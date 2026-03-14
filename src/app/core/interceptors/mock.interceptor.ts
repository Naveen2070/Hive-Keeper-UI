import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MOCK_AUTH_RESPONSE } from '../mocks/auth.mock';

export const mockInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  if (!environment.enableMock) {
    return next(req);
  }

  const { url, method } = req;

  // Mock /auth/login
  if (url.endsWith('/auth/login') && method === 'POST') {
    return of(new HttpResponse({ status: 200, body: MOCK_AUTH_RESPONSE })).pipe(
      delay(800), // Simulate network delay
    );
  }

  // Fallback to real API for other requests
  return next(req);
};
