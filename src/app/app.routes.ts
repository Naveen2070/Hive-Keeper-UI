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
        loadChildren: () => import('./features/dashboard/routes').then((m) => m.DASHBOARD_ROUTES),
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
    redirectTo: 'dashboard',
  },
];
