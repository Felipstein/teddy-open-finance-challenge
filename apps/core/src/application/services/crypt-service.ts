export default interface ICryptService {
  compare(value: string, hash: string): Promise<boolean>;

  hash(value: string, salt?: number): Promise<string>;
}
