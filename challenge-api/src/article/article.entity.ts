import { Exclude } from 'class-transformer';
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

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

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

  favoritesCount?: number;

  favorited?: boolean;

  @AfterLoad()
  protected async assignFavorite() {
    this.favoritesCount = this.favorites.length;
    this.favorited = false;
  }
}
