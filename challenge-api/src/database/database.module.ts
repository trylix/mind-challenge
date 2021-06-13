import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: +configService.get<number>('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname.concat('/../**/*.entity{.ts,.js}')],
        migrations: [__dirname.concat('/migrations/*.{ts,js}')],
        keepConnectionAlive: configService.get<boolean>(
          'database.keepConnectionAlive',
        ),
        synchronize: configService.get<boolean>('database.synchronize'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
