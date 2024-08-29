import ValueObject, { type ValueObjectPrimitive } from '@domain/value-objects/core/value-object';

type ValueObjectsToPrimitives<T> = {
  [K in keyof T]: T[K] extends ValueObject<any> ? ValueObjectPrimitive<T[K]> : T[K];
};

export default ValueObjectsToPrimitives;
