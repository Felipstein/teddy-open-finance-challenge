import { z, ZodError } from 'zod';

import objectUtils from './utils/object-utils';
import ValidatorError from './validator-error';

type Options = {
  setEmptyStringsToNull?: boolean;
};

export type Validator = <Z extends z.ZodType>(input: any) => z.infer<Z>;

export default function createValidator<Z extends z.ZodType>(
  schema: Z,
  options?: Options,
): Validator {
  return (input: any) => {
    try {
      const setEmptyStringsToNull = options?.setEmptyStringsToNull ?? false;

      const realInput = setEmptyStringsToNull ? objectUtils.mapEmptyStrings(input) : input;

      return schema.parse(realInput) as z.infer<Z>;
    } catch (error) {
      if (!(error instanceof ZodError)) {
        throw error;
      }

      const errorOutput: Record<
        string,
        { error: string; message: string; expected?: string; received?: string }
      > = {};

      error.issues.forEach((issue) => {
        const field = issue.path.join('.');
        let error: string = issue.code;

        if (error === 'invalid_type') {
          const { expected, received } = issue as { expected: string; received: string };

          if (expected !== 'undefined' && received === 'undefined') {
            error = 'required';
          }
        }

        let expected: string | undefined;
        let received: string | undefined;

        if (error === 'invalid_type') {
          expected = (issue as any).expected;
          received = (issue as any).received;
        }

        errorOutput[field] = objectUtils.deleteUndefined({
          error,
          message: issue.message,
          expected,
          received,
        });
      });

      throw new ValidatorError(errorOutput);
    }
  };
}
