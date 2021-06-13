import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ValidationException } from 'src/exceptions/validation.exception';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(dto: AuthUserDto): Promise<User> {
    const entity = await this.userService.findByEmail(dto.email);

    const isPasswordMatching = await bcrypt.compare(
      dto.password,
      entity.password,
    );

    if (!isPasswordMatching) {
      throw new ValidationException({
        message: 'passwords do not match',
        field: 'password',
      });
    }

    return entity;
  }
}
