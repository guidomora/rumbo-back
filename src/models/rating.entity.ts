import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'ratings' })
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    transformer: {
      to: (value: number): number => value,
      from: (value: string | null): number => (value ? Number(value) : 0),
    },
  })
  score!: number;

  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  @ManyToOne(() => User, (user) => user.receivedRatings, { nullable: false, onDelete: 'CASCADE' })
  ratedUser!: User;

  @ManyToOne(() => User, (user) => user.givenRatings, { nullable: true, onDelete: 'SET NULL' })
  author?: User | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
