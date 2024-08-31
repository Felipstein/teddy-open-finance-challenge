type HttpErrorResponse = {
  causedBy?: string;
  message: string;
  details?: unknown;
  internalDetails?: {
    causedByUserId?: string;
    stack?: string;
  };
};

export default HttpErrorResponse;
