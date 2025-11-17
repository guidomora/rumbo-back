import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Trip } from '../models/trip.entity';
import { TripSelection } from '../models/trip-selection.entity';
import { User } from '../models/user.entity';
import { Rating } from '../models/rating.entity';

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USERNAME = 'postgres',
  DB_PASSWORD = 'postgres',
  DB_NAME = 'rumbo',
  DB_LOGGING = 'false',
  DB_SYNCHRONIZE = 'false',
  DATABASE_URL,
  NODE_ENV,
} = process.env;


const isProd = NODE_ENV === 'production';

// console.log('DB_USER>>', DB_USERNAME);

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(DATABASE_URL
    ? {
        url: DATABASE_URL,
        ssl: isProd ? { rejectUnauthorized: false } : false,
      }
    : {
        host: DB_HOST,
        port: Number(DB_PORT),
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
      }),
  synchronize: DB_SYNCHRONIZE === 'true',
  logging: DB_LOGGING === 'true',
  entities: [Trip, TripSelection, User, Rating],
});

export const initializeDataSource = async (): Promise<DataSource> => {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  return AppDataSource.initialize();
};