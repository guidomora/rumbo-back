import {
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Entity,
  } from 'typeorm';
  
  @Entity({ name: 'trips' })
  export class Trip {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column({ type: 'varchar', length: 255 })
    driverId!: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    createdByUserId?: string | null;
  
    @Column({ type: 'varchar', length: 255 })
    origin!: string;
  
    @Column({ type: 'varchar', length: 255 })
    destination!: string;
  
    @Column({ type: 'date' })
    date!: string;
  
    @Column({ type: 'time without time zone' })
    time!: string;
  
    @Column({ type: 'int' })
    availableSeats!: number;
  
    @Column({ type: 'numeric', precision: 10, scale: 2 })
    pricePerPerson!: number;
  
    @Column({ type: 'varchar', length: 255 })
    vehicle!: string;
  
    @Column({ type: 'boolean', default: false })
    music!: boolean;
  
    @Column({ type: 'boolean', default: false })
    pets!: boolean;
  
    @Column({ type: 'boolean', default: false })
    children!: boolean;
  
    @Column({ type: 'boolean', default: false })
    luggage!: boolean;
  
    @Column({ type: 'text', nullable: true })
    notes?: string | null;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
  }