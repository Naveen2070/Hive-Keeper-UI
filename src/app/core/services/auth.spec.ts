import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService, User } from './auth';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage
    const localStorageMock = (() => {
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
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and set user signal', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
      token: 'mock-token',
    };
    const credentials = { email: 'test@test.com', password: 'password123' };

    service.login(credentials).subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(service.user()).toEqual(mockUser);
      expect(service.isAuthenticated()).toBe(true);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('hive_token', 'mock-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should logout and clear signals', () => {
    // Manually set initial state
    (service as any).currentUser.set({ id: '1', name: 'Test' } as User);
    (service as any).isAuthenticated.set(true);

    service.logout();

    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('hive_token');
  });
});
