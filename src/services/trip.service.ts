import { DataSource, Repository } from 'typeorm';
import { Trip } from '../models/trip.entity';
import { AppDataSource } from '../database/data-source';

export interface CreateTripInput {
  driverId: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  availableSeats: number;
  pricePerPerson: number;
  vehicle: string;
  music?: boolean;
  pets?: boolean;
  children?: boolean;
  luggage?: boolean;
  notes?: string | null;
  createdByUserId?: string | null;
}

export class TripService {
  constructor(private readonly dataSource: DataSource = AppDataSource) {}

  private get repository(): Repository<Trip> {
    if (!this.dataSource.isInitialized) {
      throw new Error('Data source has not been initialized.');
    }

    return this.dataSource.getRepository(Trip);
  }

  async createTrip(input: CreateTripInput): Promise<Trip> {
    const repository = this.repository;

    const trip = repository.create({
      ...input,
      music: input.music ?? false,
      pets: input.pets ?? false,
      children: input.children ?? false,
      luggage: input.luggage ?? false,
      notes: input.notes ?? null,
      createdByUserId: input.createdByUserId ?? null,
    });

    return repository.save(trip);
  }

    async getPublishedTrips(): Promise<Trip[]> {
    const repository = this.repository;

    return repository.find({
      order: {
        date: 'ASC',
        time: 'ASC',
      },
    });
  }
}