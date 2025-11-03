import { Request, Response } from 'express';
import { UserService, UserServiceError } from '../services/ser.service';
import {
  ensureRequiredFields,
  parseNumber,
  parseString,
  validateEmail,
  validatePassword,
  validatePhone,
} from '../utils/validation';

type UserRequestBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  password?: unknown;
  dni?: unknown;
};

const REQUIRED_FIELDS: Array<keyof UserRequestBody> = ['name', 'email', 'phone', 'password', 'dni'];

type LoginRequestBody = {
  email?: unknown;
  password?: unknown;
};

const LOGIN_REQUIRED_FIELDS: Array<keyof LoginRequestBody> = ['email', 'password'];

type RateUserRequestBody = {
  score?: unknown;
  comment?: unknown;
  authorId?: unknown;
};

const RATE_REQUIRED_FIELDS: Array<keyof RateUserRequestBody> = ['score'];

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  createUser = async (req: Request, res: Response): Promise<Response> => {
    const body = req.body as UserRequestBody;

    try {
      ensureRequiredFields(body, REQUIRED_FIELDS);

      const name = parseString(body.name, 'name');
      const email = validateEmail(parseString(body.email, 'email'));
      const phone = validatePhone(parseString(body.phone, 'phone'));
      const password = validatePassword(parseString(body.password, 'password'));
      const dni = parseString(body.dni, 'dni');

      const user = await this.userService.createUser({
        name,
        email,
        phone,
        password,
        dni,
      });

      const { password: _password, ...userWithoutPassword } = user;

      return res.status(201).json({
        user: {
          ...userWithoutPassword,
          calificacionPromedio: user.calificacionPromedio,
          ratingsCount: 0,
        },
      });
    } catch (error: unknown) {
      if (error instanceof UserServiceError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Ocurrió un error inesperado.' });
    }
  };

  loginUser = async (req: Request, res: Response): Promise<Response> => {
    const body = req.body as LoginRequestBody;

    try {
      ensureRequiredFields(body, LOGIN_REQUIRED_FIELDS);

      const email = validateEmail(parseString(body.email, 'email'));
      const password = parseString(body.password, 'password');

      const user = await this.userService.login(email, password);
      const ratingsCount = await this.userService.getRatingsCount(user.id);
      const { password: _password, ...userWithoutPassword } = user;

      return res.status(200).json({
        user: {
          ...userWithoutPassword,
          calificacionPromedio: user.calificacionPromedio,
          ratingsCount,
        },
      });
    } catch (error: unknown) {
      if (error instanceof UserServiceError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Ocurrió un error inesperado.' });
    }
  };

  rateUser = async (req: Request, res: Response): Promise<Response> => {
    const body = req.body as RateUserRequestBody;
    const { id: ratedUserId } = req.params;

    if (!ratedUserId) {
      return res.status(400).json({ message: 'El usuario a calificar es requerido.' });
    }

    try {
      ensureRequiredFields(body, RATE_REQUIRED_FIELDS);

      const score = parseNumber(body.score, 'score');
      const comment = typeof body.comment === 'string' && body.comment.trim().length > 0 ? body.comment.trim() : undefined;
      const authorId = body.authorId !== undefined && body.authorId !== null ? parseString(body.authorId, 'authorId') : undefined;

      const ratingInput: {
        ratedUserId: string;
        score: number;
        comment?: string;
        authorId?: string;
      } = {
        ratedUserId,
        score,
      };

      if (comment !== undefined) {
        ratingInput.comment = comment;
      }

      if (authorId !== undefined) {
        ratingInput.authorId = authorId;
      }

      const { rating, ratedUser, ratingsCount } = await this.userService.addRating(ratingInput);

      const { password: _password, ...userWithoutPassword } = ratedUser;

      return res.status(201).json({
        rating: {
          id: rating.id,
          score: rating.score,
          comment: rating.comment,
          createdAt: rating.createdAt,
          ratedUserId,
          authorId: rating.author?.id ?? authorId ?? null,
        },
        user: {
          ...userWithoutPassword,
          calificacionPromedio: ratedUser.calificacionPromedio,
          ratingsCount,
        },
      });
    } catch (error: unknown) {
      if (error instanceof UserServiceError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Ocurrió un error inesperado.' });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = parseString(req.params.id, 'id');

      const { user, ratingsCount } = await this.userService.getUserById(userId);
      const { password: _password, ...userWithoutPassword } = user;

      return res.status(200).json({
        user: {
          ...userWithoutPassword,
          calificacionPromedio: user.calificacionPromedio,
          ratingsCount,
        },
      });
    } catch (error: unknown) {
      if (error instanceof UserServiceError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Ocurrió un error inesperado.' });
    }
  };
}
