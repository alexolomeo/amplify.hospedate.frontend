import type { Provider } from './enums/provider';
import type { Photo } from './listing/space';

export interface AuthTokens {
  access: string;
  accessExpiresIn: number;
}

export interface UserRegister {
  firstName: string;
  lastName: string;
  birthDate: string;
  password: string;
  email: string;
  verification_code?: string;
}

export interface CheckEmailResponse {
  provider: Provider;
  username: string;
  profilePicture: Photo;
}

export interface CompleteRegister {
  firstName: string;
  lastName: string;
  birthDate: string;
}
