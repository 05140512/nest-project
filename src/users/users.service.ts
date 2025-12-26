import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { BusinessException } from '../common/exceptions/business.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  // Find all users
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Find one user by id
  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  // Find user with families (一对多查询)
  async findUserWithFamilies(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['families'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  // Find user with families and pets (多级关联查询)
  async findUserWithFamiliesAndPets(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['families', 'families.pets'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  // Find user with orders and order items (多级关联查询)
  async findUserWithOrders(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['orders', 'orders.orderItems', 'orders.orderItems.product'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  // Find all users with their families (连表查询所有用户及其家庭)
  async findAllUsersWithFamilies(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['families'],
    });
  }

  // Find users by condition with relations (条件查询 + 关联)
  async findUsersByEmailWithFamilies(email: string): Promise<User[]> {
    return await this.userRepository.find({
      where: { email },
      relations: ['families'],
    });
  }

  // Update user
  async update(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    const result = await this.userRepository.update(id, updateUserDto);
    if (result.affected !== 1) {
      throw new BusinessException('更新失败,用户不存在');
    }
    return true;
  }

  // Remove user
  async remove(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);

    if (result.affected !== 1) {
      throw new NotFoundException('删除失败,用户不存在');
    }

    return true;
  }
}
