import { IsString, IsInt, Min, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatDto {
  @ApiProperty({ description: 'The name of the cat' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The age of the cat' })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ description: 'The breed of the cat' })
  @IsString()
  @IsOptional()
  breed?: string;
}
