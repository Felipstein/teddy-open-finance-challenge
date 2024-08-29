export type Obj = Record<string, any>;

export type Decoded<TPayload extends Obj> = {
  sub?: string;
  exp: number;
  iat: number;
} & TPayload;

export type VerifyStatus<TPayload extends Obj> =
  | {
      status: 'invalid' | 'expired';
      payload: null;
    }
  | {
      status: 'valid';
      payload: Decoded<TPayload>;
    };

export default interface ITokenService {
  sign<P extends Obj>(
    payload: Omit<Decoded<P>, 'iat' | 'exp'>,
    secretKey: string,
    expiresIn: string,
  ): Promise<string>;

  verify<P extends Obj>(token: string, secretKey: string): Promise<Decoded<P>>;

  verifySafe<P extends Obj>(token: string, secretKey: string): Promise<VerifyStatus<P>>;

  decode<P extends Obj>(token: string): Promise<Decoded<P> | null>;
}
