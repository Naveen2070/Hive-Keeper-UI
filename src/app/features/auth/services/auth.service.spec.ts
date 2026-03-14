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

    // Mock sessionStorage
    const sessionStorageMock = (() => {
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
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock, writable: true });
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
      token: 'mock-token',
      refreshToken: 'mock-refresh',
      email: 'test@test.com',
    };
    const credentials = { email: 'test@test.com', password: 'password123' };

    service.login(credentials).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(service.isAuthenticated()).toBe(true);
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('hive_token', 'mock-token');
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('hive_refresh', 'mock-refresh');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and clear state', () => {
    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('hive_token');
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('hive_refresh');
  });
});
