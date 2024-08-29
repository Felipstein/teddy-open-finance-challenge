import generateRandomID from '@domain/services/generate-random-id';
import Email from '@domain/value-objects/email';
import Name from '@domain/value-objects/name';
import ValueObjectsToPrimitives from '@shared/@types/value-objects-to-primitives';

import Entity from './core/entity';

type UserProps = {
  name: Name;
  email: Email;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
};

export default class User extends Entity<UserProps> {
  get name() {
    return this.props.name.value;
  }

  set name(name: string) {
    this.props.name = new Name(name);
    this.props.updatedAt = new Date();
  }

  get email() {
    return this.props.email.value;
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

  static create(
    props: ValueObjectsToPrimitives<Pick<UserProps, 'name' | 'email' | 'hashedPassword'>>,
  ) {
    const id = generateRandomID();

    return new User(id, {
      name: new Name(props.name),
      email: new Email(props.email),
      hashedPassword: props.hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
    });
  }
}
