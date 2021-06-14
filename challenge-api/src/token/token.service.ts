import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessTokenToUser(user: User) {
    return this.jwtService.sign(
      {
        name: user.username,
      },
      {
        subject: user.id,
        issuer: this.configService.get('name'),
      },
    );
  }
}
