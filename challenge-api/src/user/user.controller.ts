import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { CreateUserBodyDto } from './dto/create-user-body.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller()
@UseInterceptors(new TransformInterceptor(User))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  async create(@Body() dto: CreateUserBodyDto) {
    const user = await this.userService.create(dto.user);

    return { user };
  }

  @Post('/users/login')
  @UseGuards(LocalGuard)
  login(@AuthUser() entity: User) {
    const user = this.userService.getUserWithAccessToken(entity);

    return { user };
  }

  @Get('/user')
  @UseGuards(JwtGuard)
  currentUser(@AuthUser() user: User) {
    return { user };
  }
}
