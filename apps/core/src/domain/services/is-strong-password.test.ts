import isStrongPassword from './is-strong-password';

describe('isStrongPassword', () => {
  it.each(['P@ssw0rd', 'Str0ngP@ss!', 'Aa1!bcdef'])(
    'deve retornar como uma senha forte',
    (password) => {
      expect(isStrongPassword(password).strong).toBe(true);
    },
  );

  it.each(['abc', 'strongpassword', '23132138717', 'StrongP213saword'])(
    'deve retornar como uma senha fraca',
    (password) => {
      expect(isStrongPassword(password).strong).toBe(false);
    },
  );
});
