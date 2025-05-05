import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { AuthentificationService } from 'src/app/api';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthentificationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      request = this.addAuthorizationHeader(request, accessToken);

      // 🔍 Optionnel : décode le token si nécessaire
      const decodedToken = this.decodeJWT(accessToken);
      console.log('Payload JWT :', decodedToken);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && accessToken) {
          if (!this.refreshTokenInProgress) {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
              switchMap((response: any) => {
                const newAccessToken = response.access_token;
                const newRefreshToken = response.refresh_token;

                this.refreshTokenInProgress = false;
                this.refreshTokenSubject.next(newAccessToken);

                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                request = this.addAuthorizationHeader(request, newAccessToken);
                return next.handle(request);
              }),
              catchError((refreshError: any) => {
                this.refreshTokenInProgress = false;
                // Optionnel : redirect to login or logout
                return throwError(refreshError);
              })
            );
          } else {
            return this.refreshTokenSubject.pipe(
              switchMap((newToken: string | null) => {
                if (newToken) {
                  request = this.addAuthorizationHeader(request, newToken);
                }
                return next.handle(request);
              })
            );
          }
        }

        return throwError(() => error);
      })
    );
  }

  private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private decodeJWT(token: string): any {
    try {
      // Vérifie d'abord si le token est au format JWT valide
      if (!token || token.split('.').length !== 3) {
        console.error('Token invalide');
        return null;
      }

      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = atob(payloadBase64);
      return JSON.parse(payloadDecoded);
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
      return null;
    }
  }

}
