import { Exclude } from 'class-transformer';
import { Article } from 'src/article/article.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  body!: string;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @ManyToOne(() => Article, (article) => article.comments)
  @Exclude()
  article: Article;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}
