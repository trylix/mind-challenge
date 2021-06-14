import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { User } from 'src/user/user.entity';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @UseGuards(OptionalJwtGuard)
  @UseInterceptors(new TransformInterceptor(User))
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
}
