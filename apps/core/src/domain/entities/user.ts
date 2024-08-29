import generateRandomID from '@domain/services/generate-random-id';

import Entity from './core/entity';

type UserProps = {
  name: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
};

export default class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  get email() {
    return this.props.email;
  }

  get hashedPassword() {
    return this.props.hashedPassword;
  }

  set hashedPassword(hashedPassword: string) {
    this.props.hashedPassword = hashedPassword;
    this.props.updatedAt = new Date();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get lastLoginAt() {
    return this.props.lastLoginAt;
  }

  login() {
    this.props.lastLoginAt = new Date();
  }

  static create(props: Pick<UserProps, 'name' | 'email' | 'hashedPassword'>) {
    const id = generateRandomID();

    return new User(id, {
      name: props.name,
      email: props.email,
      hashedPassword: props.hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
    });
  }
}
