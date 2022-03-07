import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import {Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PdfFileService extends BaseApiService {

  public upload(file: FormData): Observable<any> {

    return this.http.post(`${this.apiUrl}/api/file/pdf-upload`, file)
      .pipe(catchError(response => this.handleError(response)));
  }

  public delete(filePath: string): Observable<any>{

    const options = {
      body: {
        filePath
      },
    };

    return this.http.delete(`${this.apiUrl}/api/file/pdf-delete`, options)
      .pipe(catchError(response => this.handleError(response)));
  }

  public download(filePath: string): Observable<any>{

    return this.http.get(`${this.apiUrl}/api/file/pdf-download?filePath=${filePath}`)
    .pipe(catchError(response => this.handleError(response)));
  }
}
