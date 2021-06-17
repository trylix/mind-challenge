import { Injectable } from '@nestjs/common';
import { ValidationException } from 'src/exceptions/validation.exception';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async findByUsername(username: string, currentUser?: User): Promise<User> {
    const entity = await this.userService.findByUsername(username);

    await this.checkFollow(entity, currentUser);

    return entity;
  }

  async follow(username: string, currentUser?: User): Promise<User> {
    const profile = await this.findByUsername(username);

    if (profile.id === currentUser.id) {
      throw new ValidationException({
        message: "you can't follow yourself",
        field: 'username',
      });
    }

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

  async unfollow(username: string, currentUser?: User): Promise<User> {
    const profile = await this.findByUsername(username);

    if (profile.id === currentUser.id) {
      throw new ValidationException({
        message: "you can't unfollow yourself",
        field: 'username',
      });
    }

    const userFollowing = await currentUser.followedList;

    if (Array.isArray(userFollowing) && profile.following) {
      profile.following = false;

      const index = userFollowing.findIndex((user) => user.id === profile.id);
      userFollowing.splice(index, 1);

      currentUser.followedList = Promise.resolve(userFollowing);

      await this.userService.update(currentUser, {});
    }

    return profile;
  }

  async checkFollow(user: User, currentUser?: User): Promise<User> {
    Object.assign(user, { following: false });

    if (currentUser) {
      const userFollowing = await currentUser.followedList;
      if (userFollowing?.some((user) => user.id === user.id)) {
        user.following = true;
      }
    }

    return user;
  }
}
