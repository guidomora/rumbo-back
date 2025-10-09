import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'users' })
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column({ type: 'varchar', length: 255 })
    name!: string;
  
    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;
  
    @Column({ type: 'varchar', length: 30 })
    phone!: string;
  
    @Column({ type: 'varchar', length: 255 })
    password!: string;
  
    @Column({ type: 'varchar', length: 20, unique: true })
    dni!: string;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
  }