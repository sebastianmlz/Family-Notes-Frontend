import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const notesRoutes: Routes = [
  {
    path: 'notes',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/notes-wall/notes-wall').then((m) => m.NotesWall),
  },
];
