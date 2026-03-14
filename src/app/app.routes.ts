import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { AdminLayoutContainerComponent } from './shared/components/layout/admin-layout.container';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: AdminLayoutContainerComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/components/overview.container').then(
            (m) => m.OverviewContainerComponent,
          ),
      },
      {
        path: 'cinemas',
        loadComponent: () =>
          import('./features/cinemas/components/cinemas.container').then(
            (m) => m.CinemasContainerComponent,
          ),
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
