import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthentificationService } from 'src/app/api';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshtokenInterceptorService {

  constructor(private authService: AuthentificationService,private userService:UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
              });

              return next.handle(request);
            }),
            catchError((error: HttpErrorResponse) => {
              this.userService.logout();
              return throwError(error);
            })
          );
        }

        return throwError(error);
      })
    );
  }
}
