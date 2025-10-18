import { Request, Response } from 'express';
import { UserService, UserServiceError } from '../services/ser.service';
import {
  ensureRequiredFields,
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

      return res.status(201).json({ user: userWithoutPassword });
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
      const { password: _password, ...userWithoutPassword } = user;

      return res.status(200).json({ user: userWithoutPassword });
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
