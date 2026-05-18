import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile, CreateProfileDTO } from '../models/profile.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/accounts/profiles/`;

  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl);
  }

  createProfile(data: CreateProfileDTO): Observable<Profile> {
    return this.http.post<Profile>(this.apiUrl, data);
  }
}
