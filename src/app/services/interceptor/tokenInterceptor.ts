import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { AuthentificationService } from 'src/app/api';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthentificationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');
    request = this.addAuthorizationHeader(request, accessToken || '');

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && accessToken) {
          if (!this.refreshTokenInProgress) {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
              switchMap((response: any) => {
                this.refreshTokenInProgress = false;
                this.refreshTokenSubject.next(response.accessToken);
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);

                request = this.addAuthorizationHeader(request, response.accessToken);

                return next.handle(request);
              }),
              catchError((refreshError: any) => {
                this.refreshTokenInProgress = false;
                // Handle refresh token error, e.g., log out the user or perform other appropriate actions
                return throwError(refreshError);
              })
            ) as Observable<HttpEvent<any>>; // Explicitly cast the observable type
          } else {
            return this.refreshTokenSubject.pipe(
              switchMap((accessToken: string) => {
                if (accessToken) {
                  request = this.addAuthorizationHeader(request, accessToken);
                }
                return next.handle(request);
              })
            ) as Observable<HttpEvent<any>>; // Explicitly cast the observable type
          }
        }

        return throwError(error);
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
}
