import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { User } from 'src/user/user.entity';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ArticlesDto } from './dto/articles.dto';
import { CreateArticleBodyDto } from './dto/create-article-body.dto';
import { FilterPaginationDto } from './dto/filter-pagination.dto';

@Controller('articles')
@UseInterceptors(new TransformInterceptor(Article))
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

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
}
