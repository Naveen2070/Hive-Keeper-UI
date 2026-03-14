import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginEvent, LoginViewComponent } from './login.view';

@Component({
  selector: 'app-login-container',
  imports: [LoginViewComponent],
  template: `
    <app-login-view
      [isLoading]="isLoading()"
      [errorMessage]="errorMessage()"
      (login)="onLogin($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginContainerComponent {
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin(event: LoginEvent) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(event.credentials, event.rememberMe).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Login failed. Please check your credentials.',
        );
      },
    });
  }
}
