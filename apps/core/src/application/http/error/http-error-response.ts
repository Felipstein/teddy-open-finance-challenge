import ErrorCode from '@shared/error-codes';

type HttpErrorResponse = {
  causedBy?: ErrorCode;
  message: string;
  details?: unknown;
  internalDetails?: {
    causedByUserId?: string;
    stack?: string;
  };
};

export default HttpErrorResponse;
