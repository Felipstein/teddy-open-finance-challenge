import User from '@domain/entities/user';

export default interface IUsersRepository {
  existsByEmail(email: string): Promise<boolean>;

  getByEmail(email: string): Promise<User | null>;

  save(user: User): Promise<void>;
}
