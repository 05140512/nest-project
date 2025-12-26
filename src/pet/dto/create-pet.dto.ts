import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  familyId: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

