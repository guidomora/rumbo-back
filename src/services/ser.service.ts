import { randomBytes, scrypt as scryptCallback } from 'crypto';
import { promisify } from 'util';
import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/user.entity';

const scrypt = promisify(scryptCallback);

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  dni: string;
}

export class UserServiceError extends Error {
  constructor(message: string, public readonly statusCode = 400) {
    super(message);
    this.name = 'UserServiceError';
  }
}

export class UserService {
  constructor(private readonly dataSource: DataSource = AppDataSource) {}

  private get repository(): Repository<User> {
    if (!this.dataSource.isInitialized) {
      throw new Error('Data source has not been initialized.');
    }

    return this.dataSource.getRepository(User);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, 32)) as Buffer;

    return `${salt}:${derivedKey.toString('hex')}`;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const repository = this.repository;

    const normalizedEmail = input.email.toLowerCase();
    const normalizedDni = input.dni.trim();

    const emailExists = await repository.findOne({ where: { email: normalizedEmail } });
    if (emailExists) {
      throw new UserServiceError('El email ya está registrado.', 409);
    }

    const dniExists = await repository.findOne({ where: { dni: normalizedDni } });
    if (dniExists) {
      throw new UserServiceError('El DNI ya está registrado.', 409);
    }

    const passwordHash = await this.hashPassword(input.password);

    const user = repository.create({
      name: input.name.trim(),
      email: normalizedEmail,
      phone: input.phone.trim(),
      dni: normalizedDni,
      password: passwordHash,
    });

    return repository.save(user);
  }
}