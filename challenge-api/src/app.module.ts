import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import envsConfig from './config/envs.config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { ProfileModule } from './profile/profile.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        NAME: Joi.string().default('challenge-api'),
        PORT: Joi.number().default(8090),
        TYPEORM_HOST: Joi.string().required(),
        TYPEORM_PORT: Joi.number().default(3306),
        TYPEORM_USERNAME: Joi.string().required(),
        TYPEORM_PASSWORD: Joi.string(),
        TYPEORM_DATABASE: Joi.string().required(),
        JWT_SECRET: Joi.string().default('mysupersecret'),
        ACCESS_TOKEN_DURATION_MINUTES: Joi.number().default(60),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      load: [envsConfig],
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,
    UserModule,
    PassportModule,
    AuthModule,
    TokenModule,
    ProfileModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
