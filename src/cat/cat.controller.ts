import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post('create')
  async create(@Body() dto: CreateCatDto) {
    const data = await this.catService.create(dto);
    return {
      success: true,
      data,
    };
  }

  @Get('list')
  async list() {
    return {
      success: true,
      data: await this.catService.findAll(),
    };
  }

  @Get(':id')
  async detail(@Param('id') id: number) {
    return {
      success: true,
      data: await this.catService.findOne(id),
    };
  }
  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateCatDto) {
    return {
      success: await this.catService.update(id, dto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return {
      success: await this.catService.remove(id),
    };
  }
}
