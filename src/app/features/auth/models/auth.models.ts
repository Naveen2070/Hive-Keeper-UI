// Matches the Kotlin AuthResponse DTO
export interface AuthResponse {
  token: string;
  refreshToken: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
