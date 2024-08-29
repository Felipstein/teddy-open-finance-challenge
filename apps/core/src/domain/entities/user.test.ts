import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';

import { delay } from '../../../tests-utils/delay';

import User from './user';

function createUser() {
  return User.create({
    name: 'John Doe',
    email: 'johndoe@example.com',
    hashedPassword: '1234567890',
  });
}

describe('User Entity', () => {
  it('deve criar um usuário válido', () => {
    const user = createUser();

    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('deve lançar uma exception ao criar usuário com nome inválido', () => {
    expect(() =>
      User.create({
        name: 'J@hn D@e',
        email: 'johndoe@example.com',
        hashedPassword: '1234567890',
      }),
    ).toThrow(InvalidValueObjectParseError);
  });

  it('deve lançar uma exception ao criar usuário com e-mail inválido', () => {
    expect(() =>
      User.create({
        name: 'John Doe',
        email: 'johndoe',
        hashedPassword: '1234567890',
      }),
    ).toThrow(InvalidValueObjectParseError);
  });

  it.each([
    (user: User) => {
      user.name = 'Felipe';
    },
    (user: User) => {
      user.hashedPassword = '9138238218';
    },
  ])('deve atualizar o campo updatedAt após o usuário sofrer uma mutação', async (updateUser) => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      hashedPassword: '1234567890',
    });

    expect(user.updatedAt).toEqual(user.createdAt);

    await delay();
    updateUser(user);

    expect(user.updatedAt).not.toEqual(user.createdAt);
    expect(user.updatedAt.getTime()).toBeGreaterThan(user.createdAt.getTime());
  });

  it('deve atualizar o campo lastLoginAt após o usuário fazer um login', () => {
    const user = createUser();

    expect(user.lastLoginAt).toBeNull();

    user.login();

    expect(user.lastLoginAt).not.toBeNull();
  });
});
