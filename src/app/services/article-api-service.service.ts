import { HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticleApiServiceService {
  private baseUrl = 'http://localhost:8084/api/v1/admin/articles';

  constructor(private http: HttpClient) { }

  // Import CSV
  importCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/import/csv`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
  }

  // Import Excel (optionnel)
  importExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/import/excel`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
  }
}
