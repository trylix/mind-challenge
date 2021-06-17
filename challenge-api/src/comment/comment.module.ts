import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from 'src/article/article.module';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentRepository]),
    forwardRef(() => ArticleModule),
  ],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
