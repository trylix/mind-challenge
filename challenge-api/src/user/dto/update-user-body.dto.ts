import { Type } from 'class-transformer';
import { IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

export class UpdateUserBodyDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  readonly user: UpdateUserDto;
}
