type AuthenticationData =
  | {
      isAuthenticated: true;
      accessToken: string;
      userId: string;
    }
  | {
      isAuthenticated: false;
      accessToken?: undefined;
      userId?: undefined;
    };

type CommonMetadata = AuthenticationData & {
  noAuthReason?: 'invalid-token' | 'expired-token';
};

type RequestMetadata = CommonMetadata & Record<string | number | symbol, any>;

export default RequestMetadata;
export type { CommonMetadata };
