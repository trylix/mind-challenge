import { IsOptional, IsString } from 'class-validator';
import { FilterPaginationDto } from './filter-pagination.dto';

export class ArticlesDto extends FilterPaginationDto {
  @IsOptional()
  @IsString()
  readonly tag?: string;

  @IsOptional()
  @IsString()
  readonly author?: string;

  @IsOptional()
  @IsString()
  readonly favorited?: string;
}
