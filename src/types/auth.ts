export interface Session {
  user: {
    name: string;
    email: string | undefined;
    image: string | undefined;
    accessToken: string;
    refreshToken: string;
    id: string;
  };
}
