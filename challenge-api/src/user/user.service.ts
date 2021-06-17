import { Injectable } from '@nestjs/common';
import { ValidationException } from 'src/exceptions/validation.exception';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async create(dto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });

    if (userExists) {
      if (userExists.email === dto.email) {
        throw new ValidationException({
          message: 'e-mail already registered',
          field: 'email',
        });
      }

      if (userExists.username === dto.username) {
        throw new ValidationException({
          message: 'username already registered',
          field: 'username',
        });
      }
    }

    const entity = Object.assign(new User(), dto);

    await this.userRepository.save(entity);

    return entity;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ValidationException({
        message: 'user not found',
        field: 'email',
      });
    }

    return user;
  }

  getUserWithAccessToken(user: User) {
    const token = this.tokenService.generateAccessTokenToUser(user);
    user.token = token;
    return user;
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new ValidationException({
        message: 'user not found',
        field: 'id',
      });
    }

    return user;
  }

  update(entity: User, dto: UpdateUserDto) {
    Object.assign(entity, dto);

    return this.userRepository.save(entity);
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new ValidationException({
        message: 'user not found',
        field: 'username',
      });
    }

    return user;
  }
}
