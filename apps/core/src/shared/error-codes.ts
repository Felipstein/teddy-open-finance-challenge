enum ErrorCode {
  INVALID_ID,
  INVALID_VALUE_OBJECT_PARSE,
}

export function errorCodeToString(errorCode: ErrorCode) {
  return ErrorCode[errorCode];
}

export default ErrorCode;
