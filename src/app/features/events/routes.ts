import { Routes } from '@angular/router';

export const EVENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/events.container').then((m) => m.EventsContainerComponent),
  },
];
