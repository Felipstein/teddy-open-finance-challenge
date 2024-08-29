import crypto from 'node:crypto';

import ID from '@domain/value-objects/id';

export default function generateRandomID() {
  return new ID(crypto.randomUUID());
}
