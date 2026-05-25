import { Injectable, signal } from '@angular/core';

export interface ActiveProfile {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileStateService {
  private readonly ACTIVE_PROFILE_KEY = 'active_profile';

  private _activeProfile = signal<ActiveProfile | null>(this.getProfileFromStorage());
  readonly activeProfile = this._activeProfile.asReadonly();

  setActiveProfile(profile: ActiveProfile | null): void {
    if (profile) {
      localStorage.setItem(this.ACTIVE_PROFILE_KEY, JSON.stringify(profile));
      this._activeProfile.set(profile);
    } else {
      localStorage.removeItem(this.ACTIVE_PROFILE_KEY);
      this._activeProfile.set(null);
    }
  }

  private getProfileFromStorage(): ActiveProfile | null {
    const profileJson = localStorage.getItem(this.ACTIVE_PROFILE_KEY);
    if (!profileJson) return null;

    try {
      const parsed = JSON.parse(profileJson);
      if (parsed && typeof parsed === 'object' && 'id' in parsed && 'name' in parsed) {
        return parsed as ActiveProfile;
      }
      return null;
    } catch {
      localStorage.removeItem(this.ACTIVE_PROFILE_KEY);
      return null;
    }
  }
}
