import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let findByEmail: jest.Mock;
  let bcryptCompare: jest.Mock;

  beforeEach(async () => {
    findByEmail = jest.fn();
    bcryptCompare = jest.fn();

    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when validate a user by email and password', () => {
    const mockAuthUserDto = {
      email: 'test@test.com',
      password: 'mysupersecretpassword',
    };

    describe('and the password is not matched', () => {
      let user: User;

      beforeEach(() => {
        user = new User();
        user.email = mockAuthUserDto.email;

        findByEmail.mockReturnValue(Promise.resolve(user));
        bcryptCompare.mockReturnValue(false);
      });

      it('should throw an error', async () => {
        await expect(service.validateUser(mockAuthUserDto)).rejects.toThrow(
          'passwords do not match',
        );
      });
    });

    describe('and the password is matched', () => {
      let user: User;

      beforeEach(() => {
        user = new User();
        user.email = mockAuthUserDto.email;

        findByEmail.mockReturnValue(Promise.resolve(user));
        bcryptCompare.mockReturnValue(true);
      });

      it('should return the user', async () => {
        const fetchedUser = await service.validateUser(mockAuthUserDto);
        expect(fetchedUser).toEqual(user);
      });
    });
  });
});
