enum ErrorCode {
  INVALID_ID,
  INVALID_VALUE_OBJECT_PARSE,
  NAME_TOO_SHORT,
  NAME_TOO_LONG,
  NAME_INVALID_CHARACTERS,
}

export function errorCodeToString(errorCode: ErrorCode) {
  return ErrorCode[errorCode];
}

export default ErrorCode;
