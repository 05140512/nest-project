import { Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Injectable()
export class FamilyService {
  create(createFamilyDto: CreateFamilyDto) {
    return createFamilyDto;
  }

  findAll() {
    return `This action returns all family`;
  }

  findOne(id: number) {
    return `This action returns a #${id} family`;
  }

  update(id: number, updateFamilyDto: UpdateFamilyDto) {
    return updateFamilyDto;
  }

  remove(id: number) {
    return `This action removes a #${id} family`;
  }
}
