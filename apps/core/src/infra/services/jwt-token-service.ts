import jwt from 'jsonwebtoken';

import ExpiredTokenError from '@application/errors/expired-token-error';
import InvalidTokenError from '@application/errors/invalid-token-error';
import ITokenService, { Decoded, Obj, VerifyStatus } from '@application/services/token-service';

export default class JWTTokenService implements ITokenService {
  async sign<P extends Obj>(
    payload: Omit<Decoded<P>, 'iat' | 'exp'>,
    secretKey: string,
    expiresIn: string,
  ): Promise<string> {
    return jwt.sign(payload, secretKey, { expiresIn });
  }

  async verify<P extends Obj>(token: string, secretKey: string): Promise<Decoded<P>> {
    try {
      return jwt.verify(token, secretKey) as Decoded<P>;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ExpiredTokenError();
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new InvalidTokenError();
      }

      throw error;
    }
  }

  async verifySafe<P extends Obj>(token: string, secretKey: string): Promise<VerifyStatus<P>> {
    try {
      const payload = await this.verify<P>(token, secretKey);

      return {
        status: 'valid',
        payload,
      };
    } catch (error) {
      return {
        status: error instanceof ExpiredTokenError ? 'expired' : 'invalid',
        payload: null,
      };
    }
  }

  async decode<P extends Obj>(token: string): Promise<Decoded<P> | null> {
    return jwt.decode(token) as Decoded<P> | null;
  }
}
