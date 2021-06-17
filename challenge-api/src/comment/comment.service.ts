import { Injectable } from '@nestjs/common';
import { ArticleService } from 'src/article/article.service';
import { ValidationException } from 'src/exceptions/validation.exception';
import { ProfileService } from 'src/profile/profile.service';
import { User } from 'src/user/user.entity';
import { Comment } from './comment.entity';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly articleService: ArticleService,
    private readonly profileService: ProfileService,
    private readonly commentRepository: CommentRepository,
  ) {}

  private async findById(id: number) {
    const comment = await this.commentRepository.findOne(id, {
      relations: ['article'],
    });

    if (!comment) {
      throw new ValidationException({
        message: 'comment not found',
        field: 'id',
      });
    }

    return comment;
  }

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

  async findFromArticle(slug: string, currentUser?: User) {
    const article = await this.articleService.findBySlug(slug, currentUser);

    const entities = await this.commentRepository.find({
      where: {
        article: {
          id: article.id,
        },
      },
    });

    const commentsPromise = entities.map(async (comment) => {
      await this.profileService.checkFollow(comment.author, currentUser);
      delete comment.author.email;
      return comment;
    });

    const comments = await Promise.all(commentsPromise);

    return comments;
  }

  async delete(slug: string, id: number, currentUser: User) {
    const comment = await this.findById(id);

    const article = await this.articleService.findBySlug(slug, currentUser);

    if (comment.article.id !== article.id) {
      throw new ValidationException({
        message: 'you cannot delete a comment from another post.',
        field: 'slug',
      });
    }

    if (
      article.author.id !== currentUser.id &&
      comment.author.id !== currentUser.id
    ) {
      throw new ValidationException({
        message:
          'you cannot delete a comment that is not yours without being the author of the article',
        field: 'slug',
      });
    }

    return this.commentRepository.delete(comment.id);
  }
}
