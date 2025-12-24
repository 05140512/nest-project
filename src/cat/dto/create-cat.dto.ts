import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatDto {
  @ApiProperty({ description: 'The name of the cat' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The age of the cat' })
  @IsInt()
  @Min(0)
  @Max(30)
  age: number;

  @ApiProperty({ description: 'The breed of the cat' })
  @IsString()
  @IsOptional()
  breed?: string;
}
