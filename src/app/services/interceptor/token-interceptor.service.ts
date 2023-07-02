import { Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { AuthenticationResponse } from 'src/app/api';
import {tap} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private loaderService: NgxUiLoaderService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.start();
    let authenticationResponse: AuthenticationResponse = {};
    if (localStorage.getItem('accessToken')) {
      authenticationResponse = JSON.parse(
        localStorage.getItem('accessToken') as string
      );
      const authReq = req.clone({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
           Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('accessToken') as string)
        })
      });
      return this.handleRequest(authReq, next);
    }
    return this.handleRequest(req, next);
  }

  handleRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.loaderService.stop();
        }
      }, (err: any) => {
        if (err.status === 401) {
          // Le token a expiré, déconnectez l'utilisateur et redirigez-le vers la page de connexion
          this.router.navigate(['/login']);
          this.loaderService.stop();
        }
          this.loaderService.stop();
      }));
  }
}
