import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // Track the raw auth response
  private authState = signal<AuthResponse | null>(null);

  // Derived state: Automatically true if authState has a token
  readonly isAuthenticated = computed(() => this.authState() !== null);

  // Derived state: Decodes the JWT on the fly to expose our Multi-Tenant roles!
  readonly userPermissions = computed(() => {
    const token = this.authState()?.token;
    if (!token) return {};

    try {
      // Decode the base64 JWT payload (the middle section of the token)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.permissions || {}; // Returns { "events": ["ROLE_ORGANIZER"] }
    } catch (e) {
      console.error('Failed to decode JWT permissions:', e);
      return {};
    }
  });

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        // 1. Save to state
        this.authState.set(response);

        // 2. Save to localStorage so they stay logged in on refresh
        localStorage.setItem('hive_token', response.token);
        localStorage.setItem('hive_refresh', response.refreshToken);
      }),
    );
  }

  logout(): void {
    this.authState.set(null);
    localStorage.removeItem('hive_token');
    localStorage.removeItem('hive_refresh');
  }

  // Helper method to load token on app startup
  loadTokenFromStorage(): void {
    const token = localStorage.getItem('hive_token');
    const refreshToken = localStorage.getItem('hive_refresh');
    // Assuming email is inside the JWT, or we just rely on token presence for now
    if (token && refreshToken) {
      this.authState.set({
        token,
        refreshToken,
        email: 'loaded-from-storage',
      });
    }
  }
}
