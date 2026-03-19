import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { AuthService } from './features/auth/services/auth.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { mockInterceptor } from './core/interceptors/mock.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([mockInterceptor, authInterceptor])),
    provideCharts(withDefaultRegisterables()),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.loadTokenFromStorage();
    }),
  ],
};
