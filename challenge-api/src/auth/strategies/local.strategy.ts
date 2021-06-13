import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { Validator } from 'class-validator';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { ValidationException } from 'src/exceptions/validation.exception';
import { AuthService } from '../auth.service';
import { AuthUserBodyDto } from '../dto/auth-user-body.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly validator;

  constructor(private readonly authService: AuthService) {
    super();

    this.validator = new Validator();
  }

  async validate(req: Request): Promise<any> {
    const body = plainToClass(AuthUserBodyDto, req.body);
    const errors = await this.validator.validate(body);
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }

    return await this.authService.validateUser(body.user);
  }
}
