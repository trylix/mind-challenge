import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Article } from 'src/article/article.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToMany(() => User, { cascade: true, lazy: true })
  @JoinTable({
    name: 'followers',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'followed_id',
      referencedColumnName: 'id',
    },
  })
  followedList: Promise<User[]>;

  @CreateDateColumn({ name: 'created_at' })
  @Exclude()
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude()
  updatedAt?: Date;

  @OneToMany(() => Article, (article) => article.author, { lazy: true })
  @Exclude()
  articles: Promise<Article[]>;

  @ManyToMany(() => Article, { lazy: true })
  @JoinTable({
    name: 'user_favorites',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
  })
  @Exclude()
  favoritedList: Promise<Article[]>;

  token?: string;

  following?: boolean;

  @BeforeInsert()
  protected async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
