import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { ValidationException } from 'src/exceptions/validation.exception';
import { ProfileService } from 'src/profile/profile.service';
import { TagService } from 'src/tag/tag.service';
import { User } from 'src/user/user.entity';
import { In } from 'typeorm';
import { Article } from './article.entity';
import { ArticleRepository } from './article.repository';
import { ArticlesDto } from './dto/articles.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { FilterPaginationDto } from './dto/filter-pagination.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

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

    entity.slug = await this.makeSlugFromTitle(dto.title);

    if (tags) {
      entity.tags = await this.tagService.create(tags);
    }

    entity.assignFields();

    await this.articleRepository.save(entity);

    delete entity.author.email;

    return entity;
  }

  async findAll(search: ArticlesDto, currentUser?: User) {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    if (search.tag) {
      queryBuilder.innerJoinAndSelect(
        'article.tags',
        'tags',
        'tags.tag = :tag',
        {
          tag: search.tag,
        },
      );
    } else {
      queryBuilder.leftJoinAndSelect('article.tags', 'tags');
    }

    if (search.author) {
      queryBuilder.innerJoinAndSelect(
        'article.author',
        'author',
        'author.username = :username',
        {
          username: search.author,
        },
      );
    } else {
      queryBuilder.leftJoinAndSelect('article.author', 'author');
    }

    if (search.favorited) {
      queryBuilder.innerJoinAndSelect(
        'article.favorites',
        'favorites',
        'favorites.username = :username',
        {
          username: search.author,
        },
      );
    } else {
      queryBuilder.leftJoinAndSelect('article.favorites', 'favorites');
    }

    const [data, articlesCount] = await queryBuilder
      .take(search.limit)
      .skip(search.offset)
      .getManyAndCount();

    const articlesPromise = data.map(async (article) => {
      await this.profileService.checkFollow(article.author, currentUser);
      delete article.author.email;

      if (
        currentUser &&
        article.favorites.find((user) => user.id === currentUser.id)
      ) {
        article.favorited = true;
      }

      return article;
    });

    const articles = await Promise.all(articlesPromise);

    return { articles, articlesCount };
  }

  async feed(search: FilterPaginationDto, currentUser: User) {
    const followedList = await currentUser.followedList;

    if (!followedList.length) {
      return { articles: [], articlesCount: 0 };
    }

    const followedIds = followedList.map((user) => user.id);

    const [data, articlesCount] = await this.articleRepository.findAndCount({
      where: {
        author: In(followedIds),
      },
      take: search.limit,
      skip: search.offset,
    });

    const articles = data.map((article) => {
      article.author.following = true;
      delete article.author.email;

      if (article.favorites.find((user) => user.id === currentUser.id)) {
        article.favorited = true;
      }

      return article;
    });

    return { articles, articlesCount };
  }

  async findBySlug(slug: string, currentUser?: User) {
    const article = await this.articleRepository.findBySlug(slug);
    if (!article) {
      throw new ValidationException({
        message: 'article not found',
        field: 'slug',
      });
    }

    await this.profileService.checkFollow(article.author, currentUser);

    delete article.author.email;

    if (
      currentUser &&
      article.favorites.find((user) => user.id === currentUser.id)
    ) {
      article.favorited = true;
    }

    return article;
  }

  async update(slug: string, dto: UpdateArticleDto, currentUser: User) {
    const entity = await this.findBySlug(slug);

    if (entity.author.id !== currentUser.id) {
      throw new ValidationException({
        message: 'you cannot modify articles that are not yours',
        field: 'author',
      });
    }

    if (dto.title && entity.title !== dto.title) {
      entity.slug = await this.makeSlugFromTitle(dto.title);
    }

    Object.assign(entity, dto);

    await this.articleRepository.save(entity);

    return entity;
  }

  async delete(slug: string, currentUser: User) {
    const entity = await this.findBySlug(slug);

    if (entity.author.id !== currentUser.id) {
      throw new ValidationException({
        message: 'you cannot delete articles that are not yours',
        field: 'author',
      });
    }

    return this.articleRepository.delete(entity.id);
  }

  async favorite(slug: string, currentUser: User) {
    const entity = await this.findBySlug(slug, currentUser);

    const favoritedUsers = entity.favorites;
    if (!favoritedUsers.find((user) => user.id === currentUser.id)) {
      favoritedUsers.push(currentUser);
    }

    entity.assignFields();

    entity.favorited = true;

    await this.articleRepository.save(entity);

    return entity;
  }

  async unfavorite(slug: string, currentUser: User) {
    const entity = await this.findBySlug(slug, currentUser);

    const favoritedUsers = entity.favorites;

    const index = favoritedUsers.findIndex(
      (user) => user.id === currentUser.id,
    );

    if (index >= 0) {
      favoritedUsers.splice(index, 1);
    }

    entity.assignFields();

    await this.articleRepository.save(entity);

    return entity;
  }
}
