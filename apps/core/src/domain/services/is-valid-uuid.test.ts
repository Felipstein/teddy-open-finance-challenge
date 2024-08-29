import isValidUUID from './is-valid-uuid';

describe('isValidUUID', () => {
  it('deve retornar true caso a UUID seja válida', () => {
    const uuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    expect(isValidUUID(uuid)).toBe(true);
  });

  it('deve retornar false caso a UUID for inválida', () => {
    const uuid = 'a0ddfe4eebc99-9c0b-4ef8-bb6-6bb9bd312';

    expect(isValidUUID(uuid)).toBe(false);
  });
});
