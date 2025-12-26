import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDogDto {
  @ApiProperty({ description: 'The name of the dog' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The age of the dog' })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ description: 'The breed of the dog' })
  @IsString()
  @IsOptional()
  description?: string;
}
