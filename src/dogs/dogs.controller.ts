import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DogsService } from './dogs.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';

@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Post('create')
  async create(@Body() createDogDto: CreateDogDto) {
    const data = await this.dogsService.create(createDogDto);
    return {
      success: true,
      data,
    };
  }

  @Get('list')
  async list() {
    return {
      success: true,
      data: await this.dogsService.findAll(),
    };
  }

  @Get('detail/:id')
  async detail(@Param('id') id: number) {
    const data = await this.dogsService.findOne(id);
    return {
      success: true,
      data,
    };
  }

  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() updateDogDto: UpdateDogDto) {
    const data = await this.dogsService.update(id, updateDogDto);
    return {
      success: true,
      data,
    };
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: number) {
    return {
      success: await this.dogsService.remove(id),
    };
  }
}
