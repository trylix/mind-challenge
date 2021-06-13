import { Type } from 'class-transformer';
import { IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { AuthUserDto } from './auth-user.dto';

export class AuthUserBodyDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AuthUserDto)
  readonly user: AuthUserDto;
}
