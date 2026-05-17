import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { familiesRoutes } from './features/families/families.routes';

export const routes: Routes = [
  ...authRoutes,
  ...familiesRoutes,
  {
    path: '',
    redirectTo: 'profiles',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
