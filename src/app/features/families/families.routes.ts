import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const familiesRoutes: Routes = [
  {
    path: 'profiles',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profiles/profiles').then((m) => m.Profiles),
  },
];
