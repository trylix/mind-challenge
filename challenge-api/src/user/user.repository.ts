import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByEmail(email: string) {
    return this.findOne({
      where: {
        email,
      },
    });
  }

  findByUsername(username: string) {
    return this.findOne({
      where: {
        username,
      },
    });
  }
}
