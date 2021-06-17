import { Exclude } from 'class-transformer';
import { Article } from 'src/article/article.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  @JoinColumn([{ name: 'authorId', referencedColumnName: 'id' }])
  author: User;

  @ManyToOne(() => Article)
  @JoinColumn([{ name: 'articleId', referencedColumnName: 'id' }])
  @Exclude()
  article: Article;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}
