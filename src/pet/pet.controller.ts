import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petService.create(createPetDto);
  }

  @Get()
  findAll() {
    return this.petService.findAll();
  }

  @Get('with-family')
  findAllWithFamilies() {
    return this.petService.findAllPetsWithFamilies();
  }

  @Get('by-family/:familyId')
  findByFamilyId(@Param('familyId', ParseIntPipe) familyId: number) {
    return this.petService.findPetsByFamilyId(familyId);
  }

  @Get('by-type/:type')
  findByType(@Param('type') type: string) {
    return this.petService.findPetsByTypeWithFamily(type);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.petService.findOne(id);
  }

  @Get(':id/with-family')
  findOneWithFamily(@Param('id', ParseIntPipe) id: number) {
    return this.petService.findPetWithFamily(id);
  }

  @Get(':id/with-family-user')
  findOneWithFamilyAndUser(@Param('id', ParseIntPipe) id: number) {
    return this.petService.findPetWithFamilyAndUser(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return this.petService.update(id, updatePetDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.petService.remove(id);
  }
}

