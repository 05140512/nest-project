import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { BusinessException } from '../common/exceptions/business.exception';
import { User } from '../users/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { OrderItem } from '../order-item/entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly dataSource: DataSource,
  ) {}

  // Create order with order items (创建订单并关联订单项和商品)
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: createOrderDto.userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // Use transaction to ensure data consistency
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate order number if not provided
      const orderNo =
        createOrderDto.orderNo ||
        `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

      // Calculate total amount
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const item of createOrderDto.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`商品 ${item.productId} 不存在`);
        }

        if (product.stock < item.quantity) {
          throw new BusinessException(
            `商品 ${product.name} 库存不足，当前库存：${product.stock}`,
          );
        }

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;

        const orderItem = queryRunner.manager.create(OrderItem, {
          product,
          quantity: item.quantity,
          price: product.price,
          subtotal,
        });

        orderItems.push(orderItem);

        // Update product stock
        await queryRunner.manager.update(Product, product.id, {
          stock: product.stock - item.quantity,
        });
      }

      // Create order
      const order = queryRunner.manager.create(Order, {
        orderNo,
        userId: createOrderDto.userId,
        user,
        status: createOrderDto.status || OrderStatus.PENDING,
        totalAmount,
        remark: createOrderDto.remark,
        orderItems,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      // Save order items
      for (const orderItem of orderItems) {
        orderItem.orderId = savedOrder.id;
        await queryRunner.manager.save(OrderItem, orderItem);
      }

      await queryRunner.commitTransaction();

      // Return order with relations
      return await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['user', 'orderItems', 'orderItems.product'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Find all orders
  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  // Find one order by id
  async findOne(id: number): Promise<Order | null> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  // Find order with user (多对一查询：查询订单及其所属用户)
  async findOrderWithUser(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  // Find order with order items and products (多级关联查询)
  async findOrderWithItems(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  // Find order with all relations (完整关联查询)
  async findOrderWithAllRelations(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  // Find all orders with users (连表查询所有订单及其用户)
  async findAllOrdersWithUsers(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user'],
    });
  }

  // Find orders by user id (根据用户ID查询该用户的所有订单)
  async findOrdersByUserId(userId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  // Find orders by status with relations (条件查询 + 关联)
  async findOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { status },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
  }

  // Update order
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<boolean> {
    const result = await this.orderRepository.update(id, updateOrderDto);
    if (result.affected !== 1) {
      throw new BusinessException('更新失败,订单不存在');
    }
    return true;
  }

  // Remove order
  async remove(id: number): Promise<boolean> {
    const result = await this.orderRepository.delete(id);

    if (result.affected !== 1) {
      throw new NotFoundException('删除失败,订单不存在');
    }

    return true;
  }
}

