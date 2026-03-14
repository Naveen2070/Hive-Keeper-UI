import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/overview.container').then((m) => m.OverviewContainerComponent),
  },
];
