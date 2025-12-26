import { UpdateCatDto } from './dto/update-cat.dto';
import { CreateCatDto } from './dto/create-cat.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './entities/cat.entity';
import { BusinessException } from 'src/common/exceptions/business.exception';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const cat = this.catRepository.create(createCatDto);
    return await this.catRepository.save(cat);
  }

  async findAll(): Promise<Cat[]> {
    return await this.catRepository.find();
  }

  async findOne(id: number): Promise<Cat | null> {
    const cat = await this.catRepository.findOne({ where: { id } });

    if (!cat) {
      throw new NotFoundException('猫咪不存在');
    }

    return cat;
  }

  async update(id: number, dto: UpdateCatDto): Promise<boolean> {
    const result = await this.catRepository.update(id, dto);
    if (result.affected !== 1) {
      throw new BusinessException('更新失败,猫咪不存在');
    }
    return true;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.catRepository.delete(id);

    if (result.affected !== 1) {
      throw new NotFoundException('删除失败,猫咪不存在');
    }

    return true;
  }
}
