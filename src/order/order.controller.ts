import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('with-users')
  findAllWithUsers() {
    return this.orderService.findAllOrdersWithUsers();
  }

  @Get('by-user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.orderService.findOrdersByUserId(userId);
  }

  @Get('by-status')
  findByStatus(@Query('status') status: OrderStatus) {
    return this.orderService.findOrdersByStatus(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Get(':id/with-user')
  findOneWithUser(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOrderWithUser(id);
  }

  @Get(':id/with-items')
  findOneWithItems(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOrderWithItems(id);
  }

  @Get(':id/with-all')
  findOneWithAllRelations(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOrderWithAllRelations(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}

