import { Injectable } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { IProfile } from './profile.interface';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async findByUsername(
    username: string,
    currentUser?: User,
  ): Promise<IProfile> {
    const entity = await this.userService.findByUsername(username);

    const profile = classToPlain(entity) as IProfile;
    Object.assign(profile, { following: false });

    delete profile.email;

    if (currentUser) {
      const userFollowing = await currentUser.following;
      if (userFollowing?.some((user) => user.id === entity.id)) {
        profile.following = true;
      }
    }

    return profile;
  }
}
