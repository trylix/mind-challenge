import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { User } from 'src/user/user.entity';
import { ProfileService } from './profile.service';

@Controller('profiles')
@UseInterceptors(new TransformInterceptor(User))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @UseGuards(OptionalJwtGuard)
  async getProfile(
    @Param('username') username: string,
    @AuthUser() currentUser: User,
  ) {
    const profile = await this.profileService.findByUsername(
      username,
      currentUser,
    );

    delete profile.email;

    return { profile };
  }

  @Post(':username/follow')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async follow(
    @Param('username') username: string,
    @AuthUser() currentUser: User,
  ) {
    const profile = await this.profileService.follow(username, currentUser);

    delete profile.email;

    return { profile };
  }

  @Delete(':username/follow')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async unfollow(
    @Param('username') username: string,
    @AuthUser() currentUser: User,
  ) {
    const profile = await this.profileService.unfollow(username, currentUser);

    delete profile.email;

    return { profile };
  }
}
