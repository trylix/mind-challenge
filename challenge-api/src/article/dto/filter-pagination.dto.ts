import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FilterPaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly limit: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly offset: number = 0;
}
