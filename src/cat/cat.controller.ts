import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { QueryCatDto } from './dto/query-cat.dto';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post('create')
  create(@Body() createCatDto: CreateCatDto): boolean {
    return this.catService.create(createCatDto);
  }

  @Post('update')
  update(@Body() updateCatDto: UpdateCatDto) {
    return this.catService.update(updateCatDto.id, updateCatDto);
  }

  @Get()
  findAll(@Query() query: QueryCatDto) {
    return this.catService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catService.remove(+id);
  }
}
