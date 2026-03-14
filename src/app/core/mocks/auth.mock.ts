import { AuthResponse } from '../../features/auth/models/auth.models';

export const MOCK_AUTH_RESPONSE: AuthResponse = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlkIjoiMSIsImVtYWlsIjoiYWRtaW5AaGl2ZWtlZXBlci5jb20iLCJwZXJtaXNzaW9ucyI6eyJhZG1pbiI6WyJST0xFX0FETUlOIl19LCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  refreshToken: 'mock-refresh-token-uuid',
  email: 'admin@hivekeeper.com',
};
