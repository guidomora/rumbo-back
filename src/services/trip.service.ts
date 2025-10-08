import {DataSource, Repository} from 'typeorm';
import {Trip} from '../models/trip.entity';
import {AppDataSource} from '../database/data-source';
import {TripSelection} from "../models/trip-selection.entity";

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

  private get selectionRepository(): Repository<TripSelection> {
    if (!this.dataSource.isInitialized) {
      throw new Error('Data source has not been initialized.');
    }
    return this.dataSource.getRepository(TripSelection);
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

  async selectTrip({ tripId, userId, seats }: { tripId: string; userId: string; seats: number }) {
    const trip = await this.repository.findOneBy({id: tripId});
    if (!trip) throw new Error('El viaje no existe.');

    if (trip.availableSeats < seats) {
      throw new Error('No hay suficientes asientos disponibles.');
    }

    const selection = this.selectionRepository.create({
      tripId,
      userId,
      seats
    });
    await this.selectionRepository.save(selection);

    trip.availableSeats -= seats;
    await this.repository.update(tripId, { availableSeats: trip.availableSeats });

    return trip;
  }

  async getTripById(tripId: string) {
    return await this.repository.findOneBy({id: tripId});
  }

}