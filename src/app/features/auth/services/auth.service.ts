import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthResponse, getPrimaryRole, LoginCredentials, parseJwt } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // Track the raw auth response
  private authState = signal<AuthResponse | null>(null);

  // Derived state: Automatically true if authState has a token
  readonly isAuthenticated = computed(() => this.authState() !== null);

  // Derived state: Current token
  readonly token = computed(() => this.authState()?.token ?? null);

  // Derived state: Full JWT payload
  readonly userPayload = computed(() => {
    const token = this.authState()?.token;
    return token ? parseJwt(token) : null;
  });

  // Derived state: User roles/permissions
  readonly userPermissions = computed(() => this.userPayload()?.permissions ?? {});
  // Derived state: User metadata
  readonly userEmail = computed(() => this.userPayload()?.email);
  readonly userId = computed(() => this.userPayload()?.id);

  /**
   * Get the primary role for a given domain (e.g., 'events').
   * Since this reads the 'userPayload' signal, it remains reactive.
   */
  primaryRole(domain: string = 'events'): string {
    return getPrimaryRole(this.userPayload(), domain);
  }

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
    // Check both storages, preferred remembered if available
    const token = localStorage.getItem('hive_token') || sessionStorage.getItem('hive_token');
    const refreshToken =
      localStorage.getItem('hive_refresh') || sessionStorage.getItem('hive_refresh');
    const email = localStorage.getItem('hive_email') || sessionStorage.getItem('hive_email');

    if (token && refreshToken && email) {
      this.authState.set({
        token,
        refreshToken,
        email,
      });
    }
  }
}
