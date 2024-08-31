import { z } from 'zod';

import createValidator from './validator';
import ValidatorError from './validator-error';

describe('Validator', () => {
  it('deve validar corretamente', () => {
    const input = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '123123',
    };

    const validator = createValidator(
      z.object({
        firstName: z.string(),
        lastName: z.string().transform((value) => value.toUpperCase()),
        phone: z.coerce.number(),
      }),
    );

    expect(() => validator(input)).not.toThrow();
    expect(validator(input)).toEqual({
      firstName: 'John',
      lastName: 'DOE',
      phone: 123123,
    });
  });

  it('deve lançar uma exception com informações esperadas', () => {
    const input = {
      firstName: 'John',
      lastName: null,
      email: 23,
      social: {
        twitter: true,
        instagram: 'inst',
      },
    };

    const validator = createValidator(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        password: z.string(),
        social: z.object({
          twitter: z.string(),
          instagram: z.string().min(16),
        }),
      }),
    );

    try {
      validator(input);
    } catch (error) {
      if (!(error instanceof ValidatorError)) {
        throw error;
      }

      const outputIssuesExpected = {
        lastName: {
          error: 'invalid_type',
          message: 'Expected string, received null',
          expected: 'string',
          received: 'null',
        },
        email: {
          error: 'invalid_type',
          message: 'Expected string, received number',
          expected: 'string',
          received: 'number',
        },
        password: {
          error: 'required',
          message: 'Required',
        },
        'social.twitter': {
          error: 'invalid_type',
          message: 'Expected string, received boolean',
          expected: 'string',
          received: 'boolean',
        },
        'social.instagram': {
          error: 'too_small',
          message: 'String must contain at least 16 character(s)',
        },
      };

      expect(error.issues).toEqual(outputIssuesExpected);
    }
  });

  it('deve lançar erros de validações com erros customizadas', () => {
    const input = {
      email: null,
    };

    const validator = createValidator(
      z.object({
        email: z.string({
          invalid_type_error: 'Hey, you must provide a string',
          required_error: 'Please, provide a value, this field is required',
        }),
        password: z.string({
          invalid_type_error: 'Hey, you must provide a string',
          required_error: 'Please, provide a value, this field is required',
        }),
      }),
    );

    try {
      validator(input);
    } catch (error) {
      if (!(error instanceof ValidatorError)) {
        throw error;
      }

      const outputIssuesExpected = {
        email: {
          error: 'invalid_type',
          message: 'Hey, you must provide a string',
          expected: 'string',
          received: 'null',
        },
        password: {
          error: 'required',
          message: 'Please, provide a value, this field is required',
        },
      };

      expect(error.issues).toEqual(outputIssuesExpected);
    }
  });
});
