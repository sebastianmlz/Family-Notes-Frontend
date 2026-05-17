import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest.guard';

export const authRoutes: Routes = [
	{
		path: 'login',
		canActivate: [guestGuard],
		loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing)
	}
];
