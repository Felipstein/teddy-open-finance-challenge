import { z } from 'zod';

const transformStrToBoolean = z
  .boolean()
  .or(z.string().transform((value) => (typeof value === 'string' ? value === 'true' : value)));

export default transformStrToBoolean;
