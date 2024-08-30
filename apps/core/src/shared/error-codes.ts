enum ErrorCode {
  INTERNAL_ERROR,
  INVALID_ID,
  INVALID_VALUE_OBJECT_PARSE,
  NAME_TOO_SHORT,
  NAME_TOO_LONG,
  NAME_INVALID_CHARACTERS,
  INVALID_EMAIL,
  CODE_TOO_SHORT,
  CODE_TOO_LONG,
  CODE_INVALID_CHARACTERS,
  EXPIRED_SHORTENED_LINK,
  USER_NOT_FOUND_BY_EMAIL,
  INVALID_PASSWORD,
  EMAIL_ALREADY_TAKEN,
}

export function errorCodeToString(errorCode: ErrorCode) {
  return ErrorCode[errorCode];
}

export default ErrorCode;
