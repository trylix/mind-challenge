import { Type } from 'class-transformer';
import { IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { CreateArticleDto } from './create-article.dto';

export class CreateArticleBodyDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateArticleDto)
  readonly article: CreateArticleDto;
}
