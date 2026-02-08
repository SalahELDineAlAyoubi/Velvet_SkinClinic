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
  accessToken: string;    
  refreshToken: string;   
  tokenExpiration: Date;
}
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiration: Date;
}
export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  loginCustom: string;
  userRole: number;
}
