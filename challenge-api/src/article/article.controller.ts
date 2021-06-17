import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';
import { CommentService } from 'src/comment/comment.service';
import { CreateCommentBodyDto } from 'src/comment/dto/create-comment-body.dto';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { User } from 'src/user/user.entity';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ArticlesDto } from './dto/articles.dto';
import { CreateArticleBodyDto } from './dto/create-article-body.dto';
import { FilterPaginationDto } from './dto/filter-pagination.dto';
import { UpdateArticleBodyDto } from './dto/update-article-body.dto';

@Controller('articles')
@UseInterceptors(new TransformInterceptor(Article))
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@AuthUser() user: User, @Body() dto: CreateArticleBodyDto) {
    const article = await this.articleService.create(user, dto.article);

    return { article };
  }

  @Get()
  @UseGuards(OptionalJwtGuard)
  async getAll(@Query() search: ArticlesDto, @AuthUser() user: User) {
    const result = await this.articleService.findAll(search, user);

    return result;
  }

  @Get('feed')
  @UseGuards(JwtGuard)
  feed(@Query() search: FilterPaginationDto, @AuthUser() user: User) {
    return this.articleService.feed(search, user);
  }

  @Post(':slug/comments')
  @UseGuards(JwtGuard)
  async createComment(
    @Param('slug') slug: string,
    @Body() dto: CreateCommentBodyDto,
    @AuthUser() user: User,
  ) {
    const comment = await this.commentService.create(slug, dto.comment, user);

    return { comment };
  }

  @Get(':slug/comments')
  @UseGuards(OptionalJwtGuard)
  async getComments(@Param('slug') slug: string, @AuthUser() user: User) {
    const comments = await this.commentService.findFromArticle(slug, user);

    return { comments };
  }

  @Delete(':slug/comments/:id')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async deleteComment(
    @Param('slug') slug: string,
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: User,
  ) {
    await this.commentService.delete(slug, id, user);
  }

  @Post(':slug/favorite')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async favorite(@Param('slug') slug: string, @AuthUser() user: User) {
    const article = await this.articleService.favorite(slug, user);

    return { article };
  }

  @Delete(':slug/favorite')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async unfavorite(@Param('slug') slug: string, @AuthUser() user: User) {
    const article = await this.articleService.unfavorite(slug, user);

    return { article };
  }

  @Get(':slug')
  @UseGuards(OptionalJwtGuard)
  async getSingle(@Param('slug') slug: string, @AuthUser() user: User) {
    const article = await this.articleService.findBySlug(slug, user);

    return { article };
  }

  @Put(':slug')
  @UseGuards(JwtGuard)
  async update(
    @Param('slug') slug: string,
    @Body() dto: UpdateArticleBodyDto,
    @AuthUser() user: User,
  ) {
    const article = await this.articleService.update(slug, dto.article, user);

    return { article };
  }

  @Delete(':slug')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async delete(@Param('slug') slug: string, @AuthUser() user: User) {
    await this.articleService.delete(slug, user);
  }
}
