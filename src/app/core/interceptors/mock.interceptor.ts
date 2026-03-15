import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MOCK_AUTH_RESPONSE } from '../mocks/auth.mock';
import { MOCK_CINEMAS } from '../mocks/cinema.mock';
import { MOCK_EVENTS_PAGINATED } from '../mocks/event.mock';

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

  // Mock GET /api/movies/cinemas
  if (url.endsWith('/movies/cinemas') && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_CINEMAS })).pipe(delay(500));
  }

  // Mock PATCH /api/movies/cinemas/{id}/status
  if (url.includes('/movies/cinemas/') && url.endsWith('/status') && method === 'PATCH') {
    return of(new HttpResponse({ status: 204 })).pipe(delay(400));
  }

  // Mock GET /api/events
  if (url.endsWith('/events') && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_EVENTS_PAGINATED })).pipe(delay(600));
  }

  // Mock PATCH /api/events/status/{id}
  if (url.includes('/events/status/') && method === 'PATCH') {
    return of(new HttpResponse({ status: 200, body: {} })).pipe(delay(400));
  }

  // Mock DELETE /api/events/{id}
  if (url.includes('/events/') && method === 'DELETE') {
    return of(new HttpResponse({ status: 204 })).pipe(delay(500));
  }

  // Fallback to real API for other requests
  return next(req);
};
