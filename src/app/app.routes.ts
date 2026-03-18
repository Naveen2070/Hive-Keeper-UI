import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { AdminLayoutContainerComponent } from './shared/components/layout/admin-layout/admin-layout.container';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: AdminLayoutContainerComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'cinemas',
        loadChildren: () => import('./features/cinemas/routes').then((m) => m.CINEMAS_ROUTES),
      },
      {
        path: 'events',
        loadChildren: () => import('./features/events/routes').then((m) => m.EVENTS_ROUTES),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.container').then(
        (m) => m.NotFoundContainerComponent,
      ),
  },
];
