import { DataSource, In, Repository } from 'typeorm';
import { Trip, TripState } from '../models/trip.entity';
import { AppDataSource } from '../database/data-source';
import { TripSelection } from "../models/trip-selection.entity";
import { User } from '../models/user.entity';

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
  state?: TripState;
}

export class TripService {
  constructor(private readonly dataSource: DataSource = AppDataSource) { }

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

  private get userRepository(): Repository<User> {
    if (!this.dataSource.isInitialized) {
      throw new Error('Data source has not been initialized.');
    }

    return this.dataSource.getRepository(User);
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
      state: input.state ?? 'pending',
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
    const trip = await this.repository.findOneBy({ id: tripId });
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
    return await this.repository.findOneBy({ id: tripId });
  }

  async cancelTrip(tripId: string): Promise<void> {
    const repository = this.repository;

    const result = await repository.delete(tripId);

    if (result.affected === 0) {
      throw new Error('El viaje no existe.');
    }
  }

  async getLastTripByUser(userId: string): Promise<Trip | null> {
    const repository = this.repository;

    return repository.findOne({
      where: [
        { driverId: userId },
        { createdByUserId: userId },
      ],
      order: {
        date: 'DESC',
        time: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async getAllReservations(): Promise<
      { idReserva: string; idPasajero: string; idConductor: string }[]
  > {
    const selections = await this.selectionRepository.find({
      relations: ['trip'],
    });

    return selections.map((s) => ({
      idReserva: s.id,
      idPasajero: s.userId,
      idConductor: s.trip.driverId,
    }));
  }

  async getTripsByUser(userId: string): Promise<Trip[]> {
    const repository = this.repository;
    const selectionRepo = this.selectionRepository;

    const createdTrips = await repository.find({
      where: [
        { driverId: userId }
      ],
      order: { date: 'DESC', time: 'DESC' },
    });

    const selections = await selectionRepo.find({
      where: { userId },
      relations: ['trip'],
    });

    const passengerTrips = selections.map((s) => s.trip);

    const allTrips = [...createdTrips, ...passengerTrips];
    const uniqueTrips = allTrips.filter(
        (trip, index, self) => index === self.findIndex((t) => t.id === trip.id),
    );

    return uniqueTrips;
  }

  async updateTripState(tripId: string, newState: TripState): Promise<Trip> {
    const repository = this.repository;

    const trip = await repository.findOneBy({ id: tripId });

    if (!trip) {
      throw new Error('El viaje no existe.');
    }

    const allowedTransitions: Record<TripState, TripState[]> = {
      pending: ['in_progress'],
      in_progress: ['completed'],
      completed: [],
    };

    const isTransitionAllowed = allowedTransitions[trip.state]?.includes(newState);

    if (!isTransitionAllowed) {
      throw new Error('Transición de estado no válida para el viaje.');
    }

    trip.state = newState;

    return repository.save(trip);
  }

  async getPassengersByTrip(
    tripId: string,
  ): Promise<Array<{ id: string; name: string; email: string; phone: string; dni: string; seats: number }>> {
    const repository = this.repository;
    const selectionRepository = this.selectionRepository;
    const userRepository = this.userRepository;

    const trip = await repository.findOne({ where: { id: tripId } });

    if (!trip) {
      throw new Error('El viaje no existe.');
    }

    const selections = await selectionRepository.find({ where: { tripId } });

    if (selections.length === 0) {
      return [];
    }

    const userIds = selections.map((selection) => selection.userId);
    const users = await userRepository.find({ where: { id: In(userIds) } });
    const usersById = new Map(users.map((user) => [user.id, user]));

    return selections
      .map((selection) => {
        const user = usersById.get(selection.userId);
        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          dni: user.dni,
          seats: selection.seats,
        };
      })
      .filter((passenger): passenger is { id: string; name: string; email: string; phone: string; dni: string; seats: number } =>
        passenger !== null,
      );
  }
}
