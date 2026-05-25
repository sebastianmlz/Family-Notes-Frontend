import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { familiesRoutes } from './features/families/families.routes';
import { notesRoutes } from './features/notes/notes.routes';

export const routes: Routes = [
  ...authRoutes,
  ...familiesRoutes,
  ...notesRoutes,
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
