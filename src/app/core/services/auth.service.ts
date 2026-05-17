import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, User, LoginCredentials, RegisterCredentials } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}`;
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';
  private _isAuthenticated = signal<boolean>(!!this.getAccessToken());
  private _currentUser = signal<User | null>(this.getUserFromStorage());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._isAuthenticated());

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/token/`, credentials).pipe(
      tap((response) => this.saveAuthenticationData(response)),
      catchError((error) => throwError(() => this.mapAuthError(error))),
    );
  }

  register(data: RegisterCredentials): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/accounts/users/`, data)
      .pipe(catchError((error) => throwError(() => this.mapAuthError(error))));
  }

  logout(): void {
    this.clearAuthenticationData();
  }

  refreshAccessToken(): Observable<{ access: string }> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.clearAuthenticationData();
      return throwError(() => new Error('Refresh token no encontrado.'));
    }

    return this.http
      .post<{ access: string }>(`${this.apiUrl}/token/refresh/`, { refresh: refreshToken })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.ACCESS_TOKEN_KEY, response.access);
        }),
        catchError((error) => {
          this.clearAuthenticationData();
          return throwError(() => this.mapAuthError(error));
        }),
      );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private saveAuthenticationData(response: AuthResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh);
    this._isAuthenticated.set(true);

    if (response.user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      this._currentUser.set(response.user);
    }
  }

  private clearAuthenticationData(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this._isAuthenticated.set(false);
    this._currentUser.set(null);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
    } catch {
      this.clearAuthenticationData();
      return null;
    }
  }

  private mapAuthError(error: unknown): Error {
    if (error instanceof Error) return error;
    return new Error('Authentication request failed.');
  }
}
