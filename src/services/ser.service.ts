import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Rating } from '../models/rating.entity';
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
    this.ensureDataSourceInitialized();
    return this.dataSource.getRepository(User);
  }

  private get ratingRepository(): Repository<Rating> {
    this.ensureDataSourceInitialized();
    return this.dataSource.getRepository(Rating);
  }

  private ensureDataSourceInitialized(): void {
    if (!this.dataSource.isInitialized) {
      throw new Error('Data source has not been initialized.');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, 32)) as Buffer;

    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [salt, hash] = storedHash.split(':');

    if (!salt || !hash) {
      throw new Error('Formato de contraseña almacenada inválido.');
    }

    const derivedKey = (await scrypt(password, salt, 32)) as Buffer;
    const storedKey = Buffer.from(hash, 'hex');

    if (storedKey.length !== derivedKey.length) {
      return false;
    }

    return timingSafeEqual(storedKey, derivedKey);
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
      calificacionPromedio: 0,
    });

    return repository.save(user);
  }

  async login(email: string, password: string): Promise<User> {
    const repository = this.repository;
    const normalizedEmail = email.toLowerCase();

    const user = await repository.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      throw new UserServiceError('Credenciales inválidas.', 401);
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new UserServiceError('Credenciales inválidas.', 401);
    }

    return user;
  }

  async getUserById(id: string): Promise<{ user: User; ratingsCount: number }> {
    const repository = this.repository;
    const trimmedId = id.trim();

    const user = await repository.findOne({ where: { id: trimmedId } });

    if (!user) {
      throw new UserServiceError('El usuario no existe.', 404);
    }

    const ratingsCount = await this.getRatingsCount(user.id);

    return { user, ratingsCount };
  }

  async getRatingsCount(userId: string): Promise<number> {
    const repository = this.ratingRepository;
    return repository.count({ where: { ratedUser: { id: userId } } });
  }

  async addRating(input: {
    ratedUserId: string;
    score: number;
    comment?: string;
    authorId?: string;
  }): Promise<{ rating: Rating; ratedUser: User; ratingsCount: number }> {
    this.ensureDataSourceInitialized();

    const normalizedScore = Math.round(input.score * 100) / 100;

    if (normalizedScore < 1 || normalizedScore > 5) {
      throw new UserServiceError('La calificación debe estar entre 1 y 5.', 400);
    }

    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const ratingRepository = manager.getRepository(Rating);

      const ratedUser = await userRepository.findOne({ where: { id: input.ratedUserId } });

      if (!ratedUser) {
        throw new UserServiceError('El usuario a calificar no existe.', 404);
      }

      let author: User | null = null;

      if (input.authorId) {
        author = await userRepository.findOne({ where: { id: input.authorId } });

        if (!author) {
          throw new UserServiceError('El autor de la calificación no existe.', 404);
        }
      }

      const trimmedComment = input.comment?.trim();

      const rating = ratingRepository.create({
        score: normalizedScore,
        comment: trimmedComment && trimmedComment.length > 0 ? trimmedComment : null,
        ratedUser,
        author: author ?? null,
      });

      const savedRating = await ratingRepository.save(rating);

      const stats = await ratingRepository
        .createQueryBuilder('rating')
        .select('AVG(rating.score)', 'avg')
        .addSelect('COUNT(rating.id)', 'count')
        .where('rating.ratedUserId = :userId', { userId: ratedUser.id })
        .getRawOne<{ avg: string | null; count: string }>();

      const average = stats?.avg ? Math.round(Number(stats.avg) * 100) / 100 : 0;
      ratedUser.calificacionPromedio = average;

      await userRepository.save(ratedUser);

      return {
        rating: savedRating,
        ratedUser,
        ratingsCount: stats?.count ? Number(stats.count) : 0,
      };
    });
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const repository = this.repository;
    const trimmedId = userId.trim();

    const user = await repository.findOne({ where: { id: trimmedId } });

    if (!user) {
      throw new UserServiceError('El usuario no existe.', 404);
    }

    const passwordHash = await this.hashPassword(newPassword);
    user.password = passwordHash;

    return repository.save(user);
  }
}