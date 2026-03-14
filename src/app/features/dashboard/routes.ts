import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'overview',
    loadComponent: () =>
      import('./components/overview.container').then((m) => m.OverviewContainerComponent),
  },
  {
    path: 'cinemas',
    loadComponent: () =>
      import('../cinemas/components/cinemas.container').then((m) => m.CinemasContainerComponent),
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
];
