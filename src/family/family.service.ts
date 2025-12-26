import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family } from './entities/family.entity';
import { BusinessException } from '../common/exceptions/business.exception';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create family with user relation (创建家庭并关联用户)
  async create(createFamilyDto: CreateFamilyDto): Promise<Family> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: createFamilyDto.userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const family = this.familyRepository.create({
      ...createFamilyDto,
      user,
    });

    return await this.familyRepository.save(family);
  }

  // Find all families
  async findAll(): Promise<Family[]> {
    return await this.familyRepository.find();
  }

  // Find one family by id
  async findOne(id: number): Promise<Family | null> {
    const family = await this.familyRepository.findOne({ where: { id } });

    if (!family) {
      throw new NotFoundException('家庭不存在');
    }

    return family;
  }

  // Find family with user (多对一查询：查询家庭及其所属用户)
  async findFamilyWithUser(familyId: number): Promise<Family> {
    const family = await this.familyRepository.findOne({
      where: { id: familyId },
      relations: ['user'],
    });

    if (!family) {
      throw new NotFoundException('家庭不存在');
    }

    return family;
  }

  // Find family with pets (一对多查询：查询家庭及其所有宠物)
  async findFamilyWithPets(familyId: number): Promise<Family> {
    const family = await this.familyRepository.findOne({
      where: { id: familyId },
      relations: ['pets'],
    });

    if (!family) {
      throw new NotFoundException('家庭不存在');
    }

    return family;
  }

  // Find family with user and pets (多级关联查询)
  async findFamilyWithUserAndPets(familyId: number): Promise<Family> {
    const family = await this.familyRepository.findOne({
      where: { id: familyId },
      relations: ['user', 'pets'],
    });

    if (!family) {
      throw new NotFoundException('家庭不存在');
    }

    return family;
  }

  // Find all families with their users (连表查询所有家庭及其用户)
  async findAllFamiliesWithUsers(): Promise<Family[]> {
    return await this.familyRepository.find({
      relations: ['user'],
    });
  }

  // Find families by user id (根据用户ID查询该用户的所有家庭)
  async findFamiliesByUserId(userId: number): Promise<Family[]> {
    return await this.familyRepository.find({
      where: { userId },
      relations: ['pets'],
    });
  }

  // Update family
  async update(id: number, updateFamilyDto: UpdateFamilyDto): Promise<boolean> {
    // If updating userId, verify user exists
    if (updateFamilyDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateFamilyDto.userId },
      });

      if (!user) {
        throw new NotFoundException('用户不存在');
      }
    }

    const result = await this.familyRepository.update(id, updateFamilyDto);
    if (result.affected !== 1) {
      throw new BusinessException('更新失败,家庭不存在');
    }
    return true;
  }

  // Remove family
  async remove(id: number): Promise<boolean> {
    const result = await this.familyRepository.delete(id);

    if (result.affected !== 1) {
      throw new NotFoundException('删除失败,家庭不存在');
    }

    return true;
  }
}
