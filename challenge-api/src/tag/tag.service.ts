import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async findTag(tag: string) {
    const entity = await this.tagRepository.findOne({
      where: {
        tag,
      },
    });

    return entity;
  }

  async create(tagList: string[]) {
    const tagsPromise = tagList.map(async (tag) => {
      const entity = await this.findTag(tag);
      if (entity) {
        return entity;
      }

      return await this.tagRepository.save({ tag });
    });

    const tags = await Promise.all(tagsPromise);

    return tags;
  }
}
