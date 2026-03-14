import { Routes } from '@angular/router';
import { LoginContainerComponent } from './components/login.container';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginContainerComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
