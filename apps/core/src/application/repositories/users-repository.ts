import User from '@domain/entities/user';

export default interface IUsersRepository {
  existsById(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;

  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;

  save(user: User): Promise<void>;
}
