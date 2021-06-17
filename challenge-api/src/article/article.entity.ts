import { Exclude } from 'class-transformer';
import { Tag } from 'src/tag/tag.entity';
import { User } from 'src/user/user.entity';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'articles' })
export class Article {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  body!: string;

  @ManyToOne(() => User, (user) => user.articles, { eager: true })
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @ManyToMany(() => Tag, { eager: true })
  @JoinTable({
    name: 'article_tags',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  @Exclude()
  tags: Tag[];

  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    name: 'user_favorites',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  @Exclude()
  favorites: User[];

  tagList: string[];

  favoritesCount?: number;

  favorited?: boolean;

  @AfterLoad()
  assignFields() {
    this.tagList = this.tags ? this.tags.map((entity) => entity.tag) : [];
    this.favoritesCount = this.favorites ? this.favorites.length : 0;
    this.favorited = false;
  }
}
