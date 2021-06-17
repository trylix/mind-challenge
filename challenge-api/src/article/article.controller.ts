import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { User } from 'src/user/user.entity';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { CreateArticleBodyDto } from './dto/create-article-body.dto';

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
}
