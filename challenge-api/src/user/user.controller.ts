import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { CreateUserBodyDto } from './dto/create-user-body.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(new TransformInterceptor(User))
  async create(@Body() dto: CreateUserBodyDto): Promise<{ user: User }> {
    const user = await this.userService.create(dto.user);

    return { user };
  }
}
