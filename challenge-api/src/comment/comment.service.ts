import { Injectable } from '@nestjs/common';
import { ArticleService } from 'src/article/article.service';
import { User } from 'src/user/user.entity';
import { Comment } from './comment.entity';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentRepository: CommentRepository,
  ) {}

  async create(slug: string, dto: CreateCommentDto, currentUser: User) {
    const author = Object.assign(new User(), currentUser);

    const article = await this.articleService.findBySlug(slug, currentUser);

    const entity = Object.assign(new Comment(), dto);

    entity.author = author;
    entity.article = article;

    await this.commentRepository.save(entity);

    entity.author.following = false;
    delete entity.author.email;

    return entity;
  }
}
