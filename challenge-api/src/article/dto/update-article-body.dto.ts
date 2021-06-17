import { Type } from 'class-transformer';
import { IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { UpdateArticleDto } from './update-article.dto';

export class UpdateArticleBodyDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UpdateArticleDto)
  readonly article: UpdateArticleDto;
}
