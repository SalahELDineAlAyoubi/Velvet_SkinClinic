export interface LoginRequest {
  loginCustom: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  firstName: string;
  lastName: string;
  loginCustom: string;
  userRole: number;
  token: string;
  tokenExpiration: Date;
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  loginCustom: string;
  userRole: number;
}
