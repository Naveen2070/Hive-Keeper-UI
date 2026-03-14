import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LoginCredentials } from '../models/auth.models';

export interface LoginEvent {
  credentials: LoginCredentials;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login-view',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './login.view.html',
  styleUrls: ['./login.view.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginViewComponent {
  isLoading = input<boolean>(false);
  errorMessage = input<string | null>(null);

  login = output<LoginEvent>();

  hidePassword = true;

  private fb = new FormBuilder();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [true],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.getRawValue();
      if (email && password) {
        this.login.emit({
          credentials: { email, password },
          rememberMe: !!rememberMe,
        });
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }
}
