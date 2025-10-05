import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Trip } from '../models/trip.entity';

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USERNAME = 'postgres',
  DB_PASSWORD = 'postgres',
  DB_NAME = 'rumbo',
  DB_LOGGING = 'false',
  DB_SYNCHRONIZE = 'false',
} = process.env;

console.log('DB_USER>>', DB_USERNAME);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: DB_SYNCHRONIZE === 'true',
  logging: DB_LOGGING === 'true',
  entities: [Trip],
});

export const initializeDataSource = async (): Promise<DataSource> => {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  return AppDataSource.initialize();
};