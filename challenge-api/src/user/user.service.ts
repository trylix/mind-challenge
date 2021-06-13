import { Injectable } from '@nestjs/common';
import { ValidationException } from 'src/exceptions/validation.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto) {
    const userExists = await this.userRepository.findByEmail(dto.email);
    if (userExists) {
      throw new ValidationException({
        message: 'e-mail already registered',
        field: 'email',
      });
    }

    const entity = Object.assign(new User(), dto);

    await this.userRepository.save(entity);

    return entity;
  }
}
