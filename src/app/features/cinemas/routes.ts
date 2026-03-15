import { Routes } from '@angular/router';

export const CINEMAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/cinemas.container').then((m) => m.CinemasContainerComponent),
  },
];
