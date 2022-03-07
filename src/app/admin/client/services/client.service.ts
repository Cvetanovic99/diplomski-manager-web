import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../../../_shared/models/PaginationResponse';
import { HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from '../../../_shared/services/base-api.service';
import { Client } from 'src/app/_shared/models/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseApiService {


  public index(filter: string, pageIndex: number, pageSize: number, orderBy: string = 'ID', direction: string = 'DESC'): Observable<PaginationResponse<Client>> {
    let params = new HttpParams();

    params = (filter    ?   params.set('keyword',   filter)                     : params);
    params = (pageIndex ?   params.set('pageIndex', JSON.stringify(pageIndex))  : params);
    params = (pageSize  ?   params.set('pageSize',  JSON.stringify(pageSize))   : params);
    params = (orderBy   ?   params.set('orderBy',   orderBy)                    : params);
    params = (direction ?   params.set('direction', direction)                  : params);

    return this.http.get<PaginationResponse<Client>>(this.apiUrl + '/api/clients', { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  public show(clientId: number): Observable<Client> {
    return this.http.get<Client>(this.apiUrl + `/api/clients/${clientId}`)
      .pipe(catchError(response => this.handleError(response)));
  }

  public store(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl + '/api/clients', client)
      .pipe(catchError(response => this.handleError(response)));
  }

  public update(client: Client): Observable<Client> {
    return this.http.put<Client>(this.apiUrl + `/api/clients/${client.id}`, client)
      .pipe(catchError(response => this.handleError(response)));
  }

  public destroy(clientId: number): Observable<any> {

    return this.http.delete(this.apiUrl + `/api/clients/${clientId}`)
      .pipe(catchError(response => this.handleError(response)));
  }
}
