import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'overview',
    loadComponent: () =>
      import('./components/overview.container').then((m) => m.OverviewContainerComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('../users/components/users.container').then((m) => m.UsersContainerComponent),
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
];
