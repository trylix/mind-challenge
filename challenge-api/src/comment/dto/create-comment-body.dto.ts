import { Type } from 'class-transformer';
import { IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class CreateCommentBodyDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateCommentDto)
  readonly comment: CreateCommentDto;
}
