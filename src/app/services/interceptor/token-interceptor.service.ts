import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
    // Démarrer le loader
    this.loaderService.start();
    console.log('Loader démarré pour:', req.url);

    // Vérifier si c'est une requête d'upload de fichier
    const isFileUpload = req.url.includes('/import/csv') || req.url.includes('/import/excel');

    let headers = req.headers;

    // Ajouter le token d'authentification s'il existe
    if (localStorage.getItem('accessToken')) {
      const token = localStorage.getItem('accessToken') as string;
      headers = headers.set('Authorization', 'Bearer ' + token);
    }

    if (isFileUpload) {
      // Pour les uploads de fichiers, ne pas toucher au Content-Type
      // Le navigateur le définira automatiquement comme multipart/form-data
    } else {
      // Pour les autres requêtes, définir Content-Type si pas déjà présent
      if (!headers.has('Content-Type')) {
        headers = headers.set('Content-Type', 'application/json');
      }
    }

    // TOUJOURS définir Accept: application/json pour éviter les Blobs
    if (!headers.has('Accept')) {
      headers = headers.set('Accept', 'application/json');
    }

    // Cloner la requête avec les nouveaux headers
    const authReq = req.clone({ headers });

    return next.handle(authReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log('Requête réussie:', event.url, event.status);
        }
      }),
      catchError(error => {
        console.error('Erreur HTTP:', error.status, error.message, req.url);

        if (error.status === 401) {
          console.log('Token expiré, redirection vers login');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        }

        // Propager l'erreur
        return throwError(() => error);
      }),
      finalize(() => {
        // Cette méthode est appelée TOUJOURS, que la requête réussisse ou échoue
        console.log('Loader arrêté pour:', req.url);
        this.loaderService.stop();
      })
    );
  }
}