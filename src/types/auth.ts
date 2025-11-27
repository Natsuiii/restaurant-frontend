export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface AuthSuccessResponse {
  success: true;
  message: string;
  data: AuthData;
}

export interface ValidationErrorDetail {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: ValidationErrorDetail[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}
