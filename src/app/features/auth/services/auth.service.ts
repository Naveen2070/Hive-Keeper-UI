import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthResponse, LoginCredentials } from '../models/auth.models';

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

  login(credentials: LoginCredentials, rememberMe: boolean = false): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        // 1. Save to state
        this.authState.set(response);

        // 2. Choose storage based on rememberMe
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('hive_token', response.token);
        storage.setItem('hive_refresh', response.refreshToken);
        storage.setItem('hive_email', response.email);

        // Save preference for app load
        if (rememberMe) {
          localStorage.setItem('hive_remember_me', 'true');
        } else {
          localStorage.removeItem('hive_remember_me');
        }
      }),
    );
  }

  logout(): void {
    this.authState.set(null);

    // Clear all possible storages
    localStorage.removeItem('hive_token');
    localStorage.removeItem('hive_refresh');
    localStorage.removeItem('hive_email');
    localStorage.removeItem('hive_remember_me');

    sessionStorage.removeItem('hive_token');
    sessionStorage.removeItem('hive_refresh');
    sessionStorage.removeItem('hive_email');
  }

  // Helper method to load token on app startup
  loadTokenFromStorage(): void {
    const isRemembered = localStorage.getItem('hive_remember_me') === 'true';
    const storage = isRemembered ? localStorage : sessionStorage;

    const token = storage.getItem('hive_token');
    const refreshToken = storage.getItem('hive_refresh');
    const email = storage.getItem('hive_email');

    if (token && refreshToken && email) {
      this.authState.set({
        token,
        refreshToken,
        email,
      });
    }
  }
}
