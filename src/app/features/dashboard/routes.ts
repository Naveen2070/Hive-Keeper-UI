import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'overview',
    loadComponent: () =>
      import('./components/overview.container').then((m) => m.OverviewContainerComponent),
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
];
