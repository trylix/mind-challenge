import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  let findByEmail: jest.Mock;

  beforeEach(async () => {
    findByEmail = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            save: jest.fn(() => true),
            findByEmail,
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

      it('should return the user data', async () => {
        const fetchedUser = await service.create(mockCreateUserDto);
        expect(fetchedUser).toEqual(user);
      });
    });
  });
});
