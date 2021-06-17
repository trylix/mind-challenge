import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { ProfileService } from 'src/profile/profile.service';
import { TagService } from 'src/tag/tag.service';
import { User } from 'src/user/user.entity';
import { Article } from './article.entity';
import { ArticleRepository } from './article.repository';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly tagService: TagService,
    private readonly profileService: ProfileService,
    private readonly articleRepository: ArticleRepository,
  ) {}

  private async makeSlugFromTitle(title: string, retry?: boolean) {
    let slug = slugify(title, { lower: true });

    if (retry) {
      slug = slug.concat('-', Math.random().toString(36).substr(2, 6));
    }

    const slugExists = await this.articleRepository.findBySlug(slug);

    if (slugExists) {
      slug = await this.makeSlugFromTitle(title, true);
    }

    return slug;
  }

  async create(user: User, { tagList: tags, ...dto }: CreateArticleDto) {
    const entity = Object.assign(new Article(), dto);

    await this.profileService.checkFollow(user);

    entity.author = user;
    delete entity.author.email;

    const slug = await this.makeSlugFromTitle(dto.title);
    entity.slug = slug;

    if (tags) {
      entity.tags = await this.tagService.create(tags);
    }

    entity.assignFields();

    await this.articleRepository.save(entity);

    return entity;
  }
}
