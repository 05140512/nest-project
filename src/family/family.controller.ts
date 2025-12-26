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
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Post()
  create(@Body() createFamilyDto: CreateFamilyDto) {
    return this.familyService.create(createFamilyDto);
  }

  @Get()
  findAll() {
    return this.familyService.findAll();
  }

  @Get('with-users')
  findAllWithUsers() {
    return this.familyService.findAllFamiliesWithUsers();
  }

  @Get('by-user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.familyService.findFamiliesByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.familyService.findOne(id);
  }

  @Get(':id/with-user')
  findOneWithUser(@Param('id', ParseIntPipe) id: number) {
    return this.familyService.findFamilyWithUser(id);
  }

  @Get(':id/with-pets')
  findOneWithPets(@Param('id', ParseIntPipe) id: number) {
    return this.familyService.findFamilyWithPets(id);
  }

  @Get(':id/with-user-pets')
  findOneWithUserAndPets(@Param('id', ParseIntPipe) id: number) {
    return this.familyService.findFamilyWithUserAndPets(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFamilyDto: UpdateFamilyDto,
  ) {
    return this.familyService.update(id, updateFamilyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.familyService.remove(id);
  }
}
