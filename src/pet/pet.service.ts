import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { BusinessException } from '../common/exceptions/business.exception';
import { Family } from '../family/entities/family.entity';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,
  ) {}

  // Create pet with family relation (创建宠物并关联家庭)
  async create(createPetDto: CreatePetDto): Promise<Pet> {
    // Check if family exists
    const family = await this.familyRepository.findOne({
      where: { id: createPetDto.familyId },
    });

    if (!family) {
      throw new NotFoundException('家庭不存在');
    }

    const pet = this.petRepository.create({
      ...createPetDto,
      family,
    });

    return await this.petRepository.save(pet);
  }

  // Find all pets
  async findAll(): Promise<Pet[]> {
    return await this.petRepository.find();
  }

  // Find one pet by id
  async findOne(id: number): Promise<Pet | null> {
    const pet = await this.petRepository.findOne({ where: { id } });

    if (!pet) {
      throw new NotFoundException('宠物不存在');
    }

    return pet;
  }

  // Find pet with family (多对一查询：查询宠物及其所属家庭)
  async findPetWithFamily(petId: number): Promise<Pet> {
    const pet = await this.petRepository.findOne({
      where: { id: petId },
      relations: ['family'],
    });

    if (!pet) {
      throw new NotFoundException('宠物不存在');
    }

    return pet;
  }

  // Find pet with family and user (多级关联查询：宠物 -> 家庭 -> 用户)
  async findPetWithFamilyAndUser(petId: number): Promise<Pet> {
    const pet = await this.petRepository.findOne({
      where: { id: petId },
      relations: ['family', 'family.user'],
    });

    if (!pet) {
      throw new NotFoundException('宠物不存在');
    }

    return pet;
  }

  // Find all pets with their families (连表查询所有宠物及其家庭)
  async findAllPetsWithFamilies(): Promise<Pet[]> {
    return await this.petRepository.find({
      relations: ['family'],
    });
  }

  // Find pets by family id (根据家庭ID查询该家庭的所有宠物)
  async findPetsByFamilyId(familyId: number): Promise<Pet[]> {
    return await this.petRepository.find({
      where: { familyId },
    });
  }

  // Find pets by type with family (条件查询 + 关联)
  async findPetsByTypeWithFamily(type: string): Promise<Pet[]> {
    return await this.petRepository.find({
      where: { type },
      relations: ['family'],
    });
  }

  // Update pet
  async update(id: number, updatePetDto: UpdatePetDto): Promise<boolean> {
    // If updating familyId, verify family exists
    if (updatePetDto.familyId) {
      const family = await this.familyRepository.findOne({
        where: { id: updatePetDto.familyId },
      });

      if (!family) {
        throw new NotFoundException('家庭不存在');
      }
    }

    const result = await this.petRepository.update(id, updatePetDto);
    if (result.affected !== 1) {
      throw new BusinessException('更新失败,宠物不存在');
    }
    return true;
  }

  // Remove pet
  async remove(id: number): Promise<boolean> {
    const result = await this.petRepository.delete(id);

    if (result.affected !== 1) {
      throw new NotFoundException('删除失败,宠物不存在');
    }

    return true;
  }
}

