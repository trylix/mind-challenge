import { Type } from 'class-transformer';
import { IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateUserBodyDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  readonly user: CreateUserDto;
}
