import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { Pet } from './entities/pet.entity';
import { Family } from '../family/entities/family.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, Family])],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}

