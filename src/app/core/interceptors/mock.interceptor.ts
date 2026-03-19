import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MOCK_AUTH_RESPONSE } from '../mocks/auth.mock';
import { MOCK_CINEMAS } from '../mocks/cinema.mock';
import { MOCK_EVENT_DASHBOARD_STATS, MOCK_MOVIE_DASHBOARD_STATS } from '../mocks/dashboard.mock';
import { MOCK_EVENTS_PAGINATED } from '../mocks/event.mock';
import { MOCK_USERS, MOCK_USERS_PAGINATED } from '../mocks/user.mock';

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

  // Mock GET /api/dashboard/stats
  if (url.endsWith('/dashboard/stats') && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_EVENT_DASHBOARD_STATS })).pipe(delay(500));
  }

  // Mock GET /api/movies/dashboard
  if (url.endsWith('/movies/dashboard') && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_MOVIE_DASHBOARD_STATS })).pipe(delay(500));
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

  // --- Identity Service Mocks ---

  // Mock GET /api/admin/users
  if (url.endsWith('/admin/users') && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_USERS_PAGINATED })).pipe(delay(700));
  }

  // Mock POST /api/admin/users (Create User)
  if (url.endsWith('/admin/users') && method === 'POST') {
    return of(new HttpResponse({ status: 201, body: MOCK_USERS[0] })).pipe(delay(1000));
  }

  // Mock PATCH /api/admin/users/{id}/status (Ban/Unban)
  if (url.includes('/admin/users/') && url.endsWith('/status') && method === 'PATCH') {
    return of(new HttpResponse({ status: 200, body: MOCK_USERS[0] })).pipe(delay(600));
  }

  // Mock DELETE /api/admin/users/{id}/hard (Hard Delete)
  if (url.includes('/admin/users/') && url.endsWith('/hard') && method === 'DELETE') {
    return of(new HttpResponse({ status: 204 })).pipe(delay(800));
  }

  // Fallback to real API for other requests
  return next(req);
};
