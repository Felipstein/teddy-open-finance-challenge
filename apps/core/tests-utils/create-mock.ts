export default function createMock<T>(): jest.Mocked<T> {
  const mock: Partial<jest.Mocked<T>> = {};
  return mock as jest.Mocked<T>;
}
