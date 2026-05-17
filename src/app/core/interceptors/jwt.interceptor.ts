import {
    HttpErrorResponse,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    BehaviorSubject,
    catchError,
    filter,
    finalize,
    switchMap,
    take,
    throwError
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);
const RETRY_HEADER = 'x-auth-retry';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const isApiUrl = req.url.startsWith(environment.apiBaseUrl);

    const isAuthEndpoint =
        req.url.includes('/token/') || req.url.includes('/accounts/users/');

    if (isAuthEndpoint) {
        return next(req);
    }

    let authReq = req;
    const token = authService.getAccessToken();

    if (token && isApiUrl) {
        authReq = addAuthHeader(req, token);
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            const latestToken = authService.getAccessToken();

            if (error.status === 401 && latestToken && !hasRetried(authReq)) {
                return handle401Error(authReq, next, authService, router);
            }

            return throwError(() => error);
        })
    );
};

const addAuthHeader = (
    request: HttpRequest<unknown>,
    token: string,
    retry = false
): HttpRequest<unknown> => {
    return request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
            ...(retry ? { [RETRY_HEADER]: 'true' } : {})
        }
    });
};

const hasRetried = (request: HttpRequest<unknown>): boolean => {
    return request.headers.get(RETRY_HEADER) === 'true';
};

const handle401Error = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn,
    authService: AuthService,
    router: Router
) => {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshAccessToken().pipe(
            switchMap((response) => {
                refreshTokenSubject.next(response.access);
                return next(addAuthHeader(request, response.access, true));
            }),
            catchError((err) => {
                authService.logout();
                router.navigate(['/login']);
                return throwError(() => err);
            }),
            finalize(() => {
                isRefreshing = false;
            })
        );
    }

    return refreshTokenSubject.pipe(
        filter((t): t is string => t !== null),
        take(1),
        switchMap((token) => next(addAuthHeader(request, token, true)))
    );
};