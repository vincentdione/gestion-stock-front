import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntrepriseDto } from '../api';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private baseUrl = 'http://localhost:8084/api/v1/admin/entreprises';

  constructor(private http: HttpClient) { }

  uploadEntreprise(entreprise: EntrepriseDto): Observable<EntrepriseDto> {

    return this.http.post<EntrepriseDto>(`${this.baseUrl}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
        // Ne pas mettre Content-Type ici
      })
    }).pipe(
        tap({
            next: (response) => console.log('API Response:', response),
            error: (err) => {
                console.error('API Error:', err);
                if (err.error instanceof ErrorEvent) {
                    console.error('Client-side error:', err.error.message);
                } else {
                    console.error(`Server-side error: ${err.status} - ${err.message}`);
                    console.error('Error body:', err.error);
                }
            },
            complete: () => console.log('Request completed')
        })
    );
  }
}