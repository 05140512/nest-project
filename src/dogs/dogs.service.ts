import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { Repository } from 'typeorm';
import { Dog } from './entities/dog.entity';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dog)
    private readonly dogRepository: Repository<Dog>,
  ) {}

  async create(createDogDto: CreateDogDto): Promise<Dog> {
    const dog = this.dogRepository.create(createDogDto);
    return await this.dogRepository.save(dog);
  }

  async findAll(): Promise<Dog[]> {
    return await this.dogRepository.find();
  }

  async findOne(id: number): Promise<Dog | null> {
    return await this.dogRepository.findOne({ where: { id } });
  }

  async update(id: number, updateDogDto: UpdateDogDto): Promise<boolean> {
    const result = await this.dogRepository.update(id, updateDogDto);
    return result.affected === 1;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.dogRepository.delete(id);
    return result.affected === 1;
  }
}
