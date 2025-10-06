import { Request, Response } from 'express';
import { TripService } from '../services/trip.service';

type TripRequestBody = {
  driverId?: unknown;
  createdByUserId?: unknown;
  origin?: unknown;
  destination?: unknown;
  date?: unknown;
  time?: unknown;
  availableSeats?: unknown;
  pricePerPerson?: unknown;
  vehicle?: unknown;
  music?: unknown;
  pets?: unknown;
  children?: unknown;
  luggage?: unknown;
  notes?: unknown;
};

const REQUIRED_FIELDS: Array<keyof TripRequestBody> = [
  'driverId',
  'origin',
  'destination',
  'date',
  'time',
  'availableSeats',
  'pricePerPerson',
  'vehicle',
];

export class TripController {
  constructor(private readonly tripService = new TripService()) {}

  private parseBoolean(value: unknown): boolean | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.toLowerCase().trim();
      if (['true', '1', 'yes'].includes(normalized)) {
        return true;
      }
      if (['false', '0', 'no'].includes(normalized)) {
        return false;
      }
    }

    throw new Error('El valor debe ser booleano.');
  }

  private parseNumber(value: unknown, field: string): number {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    throw new Error(`El campo ${field} debe ser numérico.`);
  }

  private parseString(value: unknown, field: string): string {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }

    throw new Error(`El campo ${field} es requerido.`);
  }

  private validateDate(value: string): string {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(value)) {
      throw new Error('El campo date debe tener el formato YYYY-MM-DD.');
    }

    return value;
  }

  private validateTime(value: string): string {
    const timePattern = /^\d{2}:\d{2}(:\d{2})?$/;

    if (!timePattern.test(value)) {
      throw new Error('El campo time debe tener el formato HH:mm o HH:mm:ss.');
    }

    return value;
  }

  private ensureRequiredFields(body: TripRequestBody): void {
    const missing = REQUIRED_FIELDS.filter((field) => body[field] === undefined || body[field] === null);

    if (missing.length > 0) {
      throw new Error(`Faltan los siguientes campos requeridos: ${missing.join(', ')}`);
    }
  }

  createTrip = async (req: Request, res: Response): Promise<Response> => {
    const body = req.body as TripRequestBody;

    try {
      this.ensureRequiredFields(body);

      const availableSeats = this.parseNumber(body.availableSeats, 'availableSeats');
      const pricePerPerson = this.parseNumber(body.pricePerPerson, 'pricePerPerson');

      if (availableSeats <= 0) {
        throw new Error('El campo availableSeats debe ser mayor a 0.');
      }

      if (pricePerPerson < 0) {
        throw new Error('El campo pricePerPerson no puede ser negativo.');
      }

      const driverId = this.parseString(body.driverId, 'driverId');
      const createdByUserId =
        body.createdByUserId === undefined || body.createdByUserId === null
          ? undefined
          : this.parseString(body.createdByUserId, 'createdByUserId');
      const origin = this.parseString(body.origin, 'origin');
      const destination = this.parseString(body.destination, 'destination');
      const date = this.validateDate(this.parseString(body.date, 'date'));
      const time = this.validateTime(this.parseString(body.time, 'time'));
      const vehicle = this.parseString(body.vehicle, 'vehicle');

      const music = this.parseBoolean(body.music);
      const pets = this.parseBoolean(body.pets);
      const children = this.parseBoolean(body.children);
      const luggage = this.parseBoolean(body.luggage);
      const notes = typeof body.notes === 'string' ? body.notes : undefined;

      const tripInput: Parameters<typeof this.tripService.createTrip>[0] = {
        driverId,
        origin,
        destination,
        date,
        time,
        availableSeats,
        pricePerPerson,
        vehicle,
      };

      if (createdByUserId !== undefined) {
        tripInput.createdByUserId = createdByUserId;
      }
      if (music !== undefined) {
        tripInput.music = music;
      }
      if (pets !== undefined) {
        tripInput.pets = pets;
      }
      if (children !== undefined) {
        tripInput.children = children;
      }
      if (luggage !== undefined) {
        tripInput.luggage = luggage;
      }
      if (notes !== undefined) {
        tripInput.notes = notes;
      }

      const trip = await this.tripService.createTrip(tripInput);

      return res.status(201).json({
        message: 'Viaje creado correctamente.',
        data: trip,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado al crear el viaje.';

      return res.status(400).json({
        message,
      });
    }
  };

    getPublishedTrips = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const trips = await this.tripService.getPublishedTrips();

      return res.status(200).json({
        message: 'Viajes publicados obtenidos correctamente.',
        data: trips,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado al obtener los viajes.';

      return res.status(500).json({
        message,
      });
    }
  };
}

export const tripController = new TripController();