import { Routes } from '@angular/router';
import { DashboardContainerComponent } from './components/dashboard.container';
import { authGuard } from '../auth/guards/auth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardContainerComponent,
    canActivate: [authGuard],
  },
];
