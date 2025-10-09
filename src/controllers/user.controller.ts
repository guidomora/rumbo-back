import { Request, Response } from 'express';
import { UserService, UserServiceError } from '../services/ser.service';

const REQUIRED_FIELDS: Array<keyof UserRequestBody> = ['name', 'email', 'phone', 'password', 'dni'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d][\d\s-]{6,}$/;

type UserRequestBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  password?: unknown;
  dni?: unknown;
};

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  private ensureRequiredFields(body: UserRequestBody): void {
    const missing = REQUIRED_FIELDS.filter((field) => body[field] === undefined || body[field] === null);

    if (missing.length > 0) {
      throw new Error(`Faltan los siguientes campos requeridos: ${missing.join(', ')}`);
    }
  }

  private parseString(value: unknown, field: keyof UserRequestBody): string {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }

    throw new Error(`El campo ${field} es requerido.`);
  }

  private validateEmail(email: string): string {
    if (!EMAIL_REGEX.test(email)) {
      throw new Error('El formato del email es inválido.');
    }

    return email.toLowerCase();
  }

  private validatePhone(phone: string): string {
    if (!PHONE_REGEX.test(phone)) {
      throw new Error('El formato del teléfono es inválido.');
    }

    return phone;
  }

  private validatePassword(password: string): string {
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.');
    }

    return password;
  }

  createUser = async (req: Request, res: Response): Promise<Response> => {
    const body = req.body as UserRequestBody;

    try {
      this.ensureRequiredFields(body);

      const name = this.parseString(body.name, 'name');
      const email = this.validateEmail(this.parseString(body.email, 'email'));
      const phone = this.validatePhone(this.parseString(body.phone, 'phone'));
      const password = this.validatePassword(this.parseString(body.password, 'password'));
      const dni = this.parseString(body.dni, 'dni');

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
}