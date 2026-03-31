import { Routes } from '@angular/router';
import { LoginContainerComponent } from './components/login.container';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: LoginContainerComponent,
  },
  {
    path: 'login',
    redirectTo: '',
    pathMatch: 'full',
  },
];
