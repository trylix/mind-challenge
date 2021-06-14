import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ProfileService } from './profile.service';

const mockUser = {
  id: '403960c6-57f5-424d-929f-761c966638b4',
  username: 'test',
  email: 'test@test.com',
};

describe('ProfileService', () => {
  let service: ProfileService;

  let findByUsername: jest.Mock;
  let update: jest.Mock;

  beforeEach(async () => {
    findByUsername = jest.fn();
    update = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: UserService,
          useValue: {
            findByUsername,
            update,
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when find a profile by username', () => {
    let user: User;
    let currentUser: User;

    beforeEach(() => {
      user = Object.assign(new User(), mockUser);
      currentUser = Object.assign(new User(), mockUser);
      findByUsername.mockReturnValue(Promise.resolve(user));
    });

    describe('and the current user is not authenticated', () => {
      it('should return "following" as false', async () => {
        const profile = await service.findByUsername(mockUser.username);

        expect(profile.following).toBeFalsy();
      });
    });

    describe('and the current user is authenticated', () => {
      describe('but not follow this profile', () => {
        it('should return "following" as false', async () => {
          const profile = await service.findByUsername(
            mockUser.username,
            currentUser,
          );

          expect(profile.following).toBeFalsy();
        });
      });

      describe('and follow this profile', () => {
        beforeEach(() => {
          currentUser.followedList = Promise.resolve([user]);
        });

        it('should return "following" as true', async () => {
          const profile = await service.findByUsername(
            mockUser.username,
            currentUser,
          );

          expect(profile.following).toBeTruthy();
        });
      });
    });
  });

  describe('when user follow a profile', () => {
    let user: User;
    let currentUser: User;

    beforeEach(() => {
      user = Object.assign(new User(), mockUser);
      currentUser = Object.assign(new User(), mockUser);
      findByUsername.mockReturnValue(Promise.resolve(user));
      update.mockReturnValue((data) => data);
    });

    it('should return "following" as true', async () => {
      const profile = await service.follow(mockUser.username, currentUser);

      expect(profile.following).toBeTruthy;
    });
  });
});
