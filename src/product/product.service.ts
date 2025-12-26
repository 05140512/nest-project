import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { BusinessException } from '../common/exceptions/business.exception';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Create product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  // Find all products
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  // Find one product by id
  async findOne(id: number): Promise<Product | null> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return product;
  }

  // Find product with order items (一对多查询：查询商品及其所有订单项)
  async findProductWithOrderItems(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['orderItems'],
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return product;
  }

  // Find product with order items and orders (多级关联查询)
  async findProductWithOrders(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['orderItems', 'orderItems.order'],
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return product;
  }

  // Find all products with order items (连表查询所有商品及其订单项)
  async findAllProductsWithOrderItems(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['orderItems'],
    });
  }

  // Update product
  async update(id: number, updateProductDto: UpdateProductDto): Promise<boolean> {
    const result = await this.productRepository.update(id, updateProductDto);
    if (result.affected !== 1) {
      throw new BusinessException('更新失败,商品不存在');
    }
    return true;
  }

  // Remove product
  async remove(id: number): Promise<boolean> {
    const result = await this.productRepository.delete(id);

    if (result.affected !== 1) {
      throw new NotFoundException('删除失败,商品不存在');
    }

    return true;
  }
}

