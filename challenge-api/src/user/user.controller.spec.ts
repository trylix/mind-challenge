import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserBodyDto } from './dto/create-user-body.dto';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let serviceSpy: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(() => true),
            getUserWithAccessToken: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    serviceSpy = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an user', async () => {
      const params: CreateUserBodyDto = {
        user: {
          email: 'test@test.com',
          password: 'test',
          username: 'test',
        },
      };

      await controller.create(params);

      expect(serviceSpy.create).toHaveBeenCalledWith(params.user);
    });
  });

  describe('login', () => {
    it('should return a authenticated user data', async () => {
      const user = new User();

      await controller.login(user);

      expect(serviceSpy.getUserWithAccessToken).toHaveBeenCalledWith(user);
    });
  });
});
