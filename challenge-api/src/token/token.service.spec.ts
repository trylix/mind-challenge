import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/user.entity';
import mockedConfigService from 'src/utils/mocks/config.service';
import mockedJwtService from 'src/utils/mocks/jwt.service';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when asked to generate an access token', () => {
    const mockId = '403960c6-57f5-424d-929f-761c966638b4';
    const mockName = 'test';

    let user: User;

    beforeEach(() => {
      user = new User();
      user.id = mockId;
      user.username = mockName;
    });

    it('should return the token', async () => {
      const serviceSpy = jest.spyOn(jwtService, 'sign');
      const token = service.generateAccessTokenToUser(user);

      expect(serviceSpy).toHaveBeenCalledWith(
        {
          name: mockName,
        },
        {
          subject: mockId,
          issuer: 'challenge-api',
        },
      );

      expect(token).toEqual('mybesttoken');
    });
  });
});
