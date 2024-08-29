import User from '@domain/entities/user';

export default interface IUsersRepository {
  getByEmail(email: string): Promise<User | null>;
}
