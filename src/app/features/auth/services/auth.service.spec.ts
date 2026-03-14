import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AuthResponse } from '../models/auth.models';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock storage
    const storageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value.toString();
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          store = {};
        }),
      };
    })();
    Object.defineProperty(window, 'sessionStorage', { value: storageMock, writable: true });
    Object.defineProperty(window, 'localStorage', { value: storageMock, writable: true });
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and set authState', () => {
    const mockResponse: AuthResponse = {
      token: 'header.payload.signature',
      refreshToken: 'mock-refresh',
      email: 'test@test.com',
    };
    const credentials = { email: 'test@test.com', password: 'password123' };

    service.login(credentials).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(service.isAuthenticated()).toBe(true);
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'hive_token',
        'header.payload.signature',
      );
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockResponse);
  });

  it('should decode user context from token', () => {
    // Mocking a JWT payload: { "sub": "123", "email": "test@test.com", "id": "user-1", "permissions": { "events": ["ROLE_ORGANIZER"] } }
    // Base64: eyAic3ViIjogIjEyMyIsICJlbWFpbCI6ICJ0ZXN0QHRlc3QuY29tIiwgImlkIjogInVzZXItMSIsICJwZXJtaXNzaW9ucyI6IHsgImV2ZW50cyI6IFsiUk9MRV9PUkdBTklaRVIiXSB9IH0=
    const mockPayload = {
      sub: '123',
      email: 'test@test.com',
      id: 'user-1',
      permissions: { events: ['ROLE_ORGANIZER'] },
    };
    const base64Payload = btoa(JSON.stringify(mockPayload));
    const mockToken = `header.${base64Payload}.signature`;

    const mockResponse: AuthResponse = {
      token: mockToken,
      refreshToken: 'mock-refresh',
      email: 'test@test.com',
    };

    service.login({ email: 'test@test.com', password: 'password123' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockResponse);

    expect(service.userEmail()).toBe('test@test.com');
    expect(service.userId()).toBe('user-1');
    expect(service.userPermissions()).toEqual({ events: ['ROLE_ORGANIZER'] });
    expect(service.primaryRole('events')).toBe('ORGANIZER');
    expect(service.primaryRole('movies')).toBe('USER'); // Default for missing domain
  });

  it('should logout and clear state', () => {
    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('hive_token');
  });
});
