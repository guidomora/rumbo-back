import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Trip } from './trip.entity';

@Entity({ name: 'trip_selections' })
export class TripSelection {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tripId' })
    trip!: Trip;

    @Column({ type: 'uuid' })
    tripId!: string;

    @Column({ type: 'varchar', length: 255 })
    userId!: string;

    @Column({ type: 'int', default: 1 })
    seats!: number;

    @UpdateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;
}
