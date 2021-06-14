import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from 'src/token/token.service';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  let findByEmail: jest.Mock;
  let findByUsername: jest.Mock;
  let findOne: jest.Mock;
  let save: jest.Mock;

  beforeEach(async () => {
    findByEmail = jest.fn();
    findByUsername = jest.fn();
    findOne = jest.fn();
    save = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            save,
            findByEmail,
            findByUsername,
            findOne,
          },
        },
        {
          provide: TokenService,
          useValue: {
            getUserWithAccessToken: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when create a new user', () => {
    const mockCreateUserDto = {
      username: 'test',
      email: 'test@test.com',
      password: 'mysupersecretpassword',
    };

    beforeEach(() => {
      save = jest.fn(() => true);
    });

    describe('and the email is already registered', () => {
      beforeEach(() => {
        findByEmail.mockReturnValue(new User());
      });

      it('should throw an error', async () => {
        await expect(service.create(mockCreateUserDto)).rejects.toThrow(
          'e-mail already registered',
        );
      });
    });

    describe('and the email is not registered', () => {
      let user: User;

      beforeEach(() => {
        user = new User();

        user.username = mockCreateUserDto.username;
        user.email = mockCreateUserDto.email;
        user.password = mockCreateUserDto.password;

        findByEmail.mockReturnValue(undefined);
      });

      describe('but the username is registered', () => {
        beforeEach(() => {
          findByUsername.mockReturnValue(Promise.resolve(user));
        });

        it('should throw an error', async () => {
          await expect(service.create(mockCreateUserDto)).rejects.toThrow(
            'username already registered',
          );
        });
      });

      describe('and the username is not registered', () => {
        beforeEach(() => {
          findByUsername.mockReturnValue(undefined);
        });

        it('should return the user data', async () => {
          const fetchedUser = await service.create(mockCreateUserDto);
          expect(fetchedUser).toEqual(user);
        });
      });
    });
  });

  describe('when trying to find the user by email', () => {
    const mockEmail = 'test@test.com';

    describe('and he does not exist', () => {
      beforeEach(() => {
        findByEmail.mockReturnValue(undefined);
      });

      it('should throw an error', async () => {
        await expect(service.findByEmail(mockEmail)).rejects.toThrow(
          'user not found',
        );
      });
    });

    describe('and he exist', () => {
      let user: User;

      beforeEach(() => {
        user = new User();
        user.email = mockEmail;

        findByEmail.mockReturnValue(Promise.resolve(user));
      });

      it('should return the user data', async () => {
        const fetchedUser = await service.findByEmail(mockEmail);
        expect(fetchedUser).toEqual(user);
      });
    });
  });

  describe('when trying to find a user by id', () => {
    const mockId = '403960c6-57f5-424d-929f-761c966638b4';

    describe('and he does not exist', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });

      it('should throw an error', async () => {
        await expect(service.findById(mockId)).rejects.toThrow(
          'user not found',
        );
      });
    });

    describe('and he exist', () => {
      let user: User;

      beforeEach(() => {
        user = new User();
        user.id = mockId;

        findOne.mockReturnValue(Promise.resolve(user));
      });

      it('should return the user data', async () => {
        const fetchedUser = await service.findById(mockId);
        expect(fetchedUser).toEqual(user);
      });
    });
  });

  describe('when update a user', () => {
    let user: User;

    const mockUserData = {
      username: 'test',
      email: 'test@test.com',
      password: 'mysupersecretpassword',
    };

    const mockUpdateUserData = {
      username: 'mytest',
      email: 'mytest@mytest.com',
    };

    beforeEach(() => {
      user = Object.assign(new User(), mockUserData);
      save = jest.fn((data) => data);
    });

    it('should return the updated user data', async () => {
      const updatedUser = await service.update(user, mockUpdateUserData);

      expect(updatedUser).not.toEqual(user);
    });
  });
});
