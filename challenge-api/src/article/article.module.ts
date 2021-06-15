import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleRepository } from './article.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleRepository])],
})
export class ArticleModule {}
