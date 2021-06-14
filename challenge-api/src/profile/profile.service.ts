import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async findByUsername(username: string, currentUser?: User): Promise<User> {
    const entity = await this.userService.findByUsername(username);

    Object.assign(entity, { following: false });

    if (currentUser) {
      const userFollowing = await currentUser.followedList;
      if (userFollowing?.some((user) => user.id === entity.id)) {
        entity.following = true;
      }
    }

    return entity;
  }

  async follow(username: string, currentUser?: User): Promise<User> {
    const profile = await this.findByUsername(username);

    let userFollowing = await currentUser.followedList;

    if (!Array.isArray(userFollowing)) {
      userFollowing = [];
    }

    if (!profile.following) {
      profile.following = true;
      userFollowing.push(profile);
      currentUser.followedList = Promise.resolve(userFollowing);
      await this.userService.update(currentUser, {});
    }

    return profile;
  }
}
