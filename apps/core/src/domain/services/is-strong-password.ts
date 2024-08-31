import domainConfig from '@config/domain-config';

export type WeakPasswordReason =
  | 'requires-min-length'
  | 'requires-number'
  | 'requires-letter'
  | 'requires-special-char';

type Status =
  | {
      strong: true;
    }
  | {
      strong: false;
      reason: WeakPasswordReason;
    };

export default function isStrongPassword(password: string): Status {
  const minLength = password.length >= domainConfig.minPasswordLength;
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!minLength) {
    return {
      strong: false,
      reason: 'requires-min-length',
    };
  }

  if (!hasNumber) {
    return {
      strong: false,
      reason: 'requires-number',
    };
  }

  if (!hasLetter) {
    return {
      strong: false,
      reason: 'requires-letter',
    };
  }

  if (!hasSpecialChar) {
    return {
      strong: false,
      reason: 'requires-special-char',
    };
  }

  return {
    strong: true,
  };
}
