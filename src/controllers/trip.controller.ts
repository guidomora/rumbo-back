import { Request, Response } from 'express';
import { TripService } from '../services/trip.service';
import {
  ensureRequiredFields,
  parseBoolean,
  parseNumber,
  parseString,
  validateDate,
  validateTime,
} from '../utils/validation';

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

  createTrip = async (req: Request, res: Response): Promise<Response> => {
    const body = req.body as TripRequestBody;

    try {
      ensureRequiredFields(body, REQUIRED_FIELDS);

      const availableSeats = parseNumber(body.availableSeats, 'availableSeats');
      const pricePerPerson = parseNumber(body.pricePerPerson, 'pricePerPerson');

      if (availableSeats <= 0) {
        throw new Error('El campo availableSeats debe ser mayor a 0.');
      }

      if (pricePerPerson < 0) {
        throw new Error('El campo pricePerPerson no puede ser negativo.');
      }

      const driverId = parseString(body.driverId, 'driverId');
      const createdByUserId =
        body.createdByUserId === undefined || body.createdByUserId === null
          ? undefined
          : parseString(body.createdByUserId, 'createdByUserId');
      const origin = parseString(body.origin, 'origin');
      const destination = parseString(body.destination, 'destination');
      const date = validateDate(parseString(body.date, 'date'));
      const time = validateTime(parseString(body.time, 'time'));
      const vehicle = parseString(body.vehicle, 'vehicle');

      const music = parseBoolean(body.music);
      const pets = parseBoolean(body.pets);
      const children = parseBoolean(body.children);
      const luggage = parseBoolean(body.luggage);
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

  selectTrip = async (req: Request, res: Response): Promise<Response> => {
    const { tripId } = req.params;
    const { userId, seats = 1 } = req.body;

    try {
      if (!tripId) {
        throw new Error('El parámetro tripId es requerido.');
      }
      if (!userId) {
        throw new Error('El campo userId es requerido.');
      }

      const seatsNumber = parseNumber(seats, 'seats');
      if (seatsNumber <= 0) {
        throw new Error('El número de asientos debe ser mayor a 0.');
      }

      const selectedTrip = await this.tripService.selectTrip({
        tripId,
        userId,
        seats: seatsNumber,
      });

      return res.status(201).json({
        message: 'Viaje reservado correctamente.',
        data: selectedTrip,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado al reservar el viaje.';
      return res.status(400).json({ message });
    }
  };

  getTripById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { tripId } = req.params;

      if (!tripId) {
        return res.status(400).json({ message: 'Falta el parámetro tripId' });
      }

      const trip = await this.tripService.getTripById(tripId);

      if (!tripId) {
        return res.status(404).json({ message: 'Viaje no encontrado' });
      }

      return res.status(200).json(trip);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado al obtener el viaje.';
      return res.status(500).json({ message });
    }
  };
}

export const tripController = new TripController();
