import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from 'src/comment/comment.module';
import { ProfileModule } from 'src/profile/profile.module';
import { TagModule } from 'src/tag/tag.module';
import { ArticleController } from './article.controller';
import { ArticleRepository } from './article.repository';
import { ArticleService } from './article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleRepository]),
    TagModule,
    ProfileModule,
    CommentModule,
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
