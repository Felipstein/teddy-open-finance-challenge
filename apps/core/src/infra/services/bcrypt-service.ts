import ICryptService from '@application/services/crypt-service';
import bcrypt from 'bcryptjs';

export default class BCryptService implements ICryptService {
  hash(value: string, salt = 10): Promise<string> {
    return bcrypt.hash(value, salt);
  }

  compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
