import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ProfileStateService } from '../services/profile-state.service';

export const activeProfileGuard: CanActivateFn = () => {
  const profileStateService = inject(ProfileStateService);
  const router = inject(Router);

  return profileStateService.activeProfile() ? true : router.createUrlTree(['/profiles']);
};
