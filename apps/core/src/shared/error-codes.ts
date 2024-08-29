enum ErrorCode {
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
}

export function errorCodeToString(errorCode: ErrorCode) {
  return ErrorCode[errorCode];
}

export default ErrorCode;
