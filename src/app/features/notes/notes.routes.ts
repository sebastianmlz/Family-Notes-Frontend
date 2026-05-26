import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { activeProfileGuard } from '../../core/guards/active-profile.guard';

export const notesRoutes: Routes = [
  {
    path: 'notes',
    canActivate: [authGuard, activeProfileGuard],
    loadComponent: () => import('./pages/notes-wall/notes-wall').then((m) => m.NotesWall),
  },
];
