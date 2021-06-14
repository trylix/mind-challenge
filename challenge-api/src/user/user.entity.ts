import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id!: string;

  @Index()
  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Index()
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
  following: Promise<User[]>;

  @CreateDateColumn({ name: 'created_at' })
  @Exclude()
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude()
  updatedAt?: Date;

  token?: string;

  @BeforeInsert()
  protected async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
