import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/user.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  let serviceSpy: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            findByUsername: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    serviceSpy = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return a user profile by username', async () => {
      const mockUsername = 'test';
      const user = new User();

      await controller.getProfile(mockUsername, user);

      expect(serviceSpy.findByUsername).toHaveBeenCalledWith(
        mockUsername,
        user,
      );
    });
  });
});
