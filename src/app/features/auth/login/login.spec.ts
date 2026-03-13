import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login';
import { AuthService } from '../../../core/services/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockAuthService = {
    login: vi.fn(),
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid form', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('should validate email field', () => {
    const email = component.loginForm.get('email');
    email?.setValue('invalid-email');
    expect(email?.hasError('email')).toBe(true);

    email?.setValue('valid@example.com');
    expect(email?.valid).toBe(true);
  });

  it('should validate password field', () => {
    const password = component.loginForm.get('password');
    password?.setValue('123');
    expect(password?.hasError('minlength')).toBe(true);

    password?.setValue('password123');
    expect(password?.valid).toBe(true);
  });

  it('should call authService.login on valid submit', () => {
    const credentials = { email: 'admin@thehive.com', password: 'password123' };
    component.loginForm.setValue(credentials);

    mockAuthService.login.mockReturnValue(of({ token: 'mock-token' }));

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.isLoading()).toBe(true); // Signal stays true until subscription completes
  });

  it('should handle login error', () => {
    component.loginForm.setValue({ email: 'admin@thehive.com', password: 'password123' });

    const errorResponse = { error: { message: 'Invalid credentials' } };
    mockAuthService.login.mockReturnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Invalid credentials');
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword()).toBe(true);

    const mockEvent = { preventDefault: vi.fn() } as any;
    component.togglePasswordVisibility(mockEvent);

    expect(component.hidePassword()).toBe(false);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
