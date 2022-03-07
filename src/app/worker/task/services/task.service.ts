import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../_shared/services/base-api.service';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../../../_shared/models/PaginationResponse';
import { catchError } from 'rxjs/operators';
import { Task } from '../../../_shared/models/Task/Task';
import {CreateTaskDto} from "../../../_shared/models/Task/CreateTaskDto";
import {UpdateTaskDto} from "../../../_shared/models/Task/UpdateTaskDto";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseApiService {

  public index(filter: string, pageIndex: number, pageSize: number, orderBy: string = 'ID', direction: string = 'DESC'): Observable<PaginationResponse<Task>> {

    const params = this.getQueryParams(filter, pageIndex, pageSize, orderBy, direction);

    return this.http.get<PaginationResponse<Task>>(this.apiUrl + '/api/tasks', { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  public show(taskId: number): Observable<Task> {
    return this.http.get<Task>(this.apiUrl + `/api/tasks/${taskId}`)
      .pipe(catchError(response => this.handleError(response)));
  }

  public store(task: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.apiUrl + '/api/tasks', task)
      .pipe(catchError(response => this.handleError(response)));
  }

  public storeArray(tasks: CreateTaskDto[]): Observable<Task[]>{
    return this.http.post<Task[]>(this.apiUrl +'/api/tasks/range', tasks)
      .pipe(catchError(response => this.handleError(response)));
  }

  public update(task: UpdateTaskDto): Observable<Task> {
    return this.http.put<Task>(this.apiUrl + `/api/tasks/${task.id}`, task)
      .pipe(catchError(response => this.handleError(response)));
  }

  public destroy(taskId: number): Observable<any> {

    return this.http.delete(this.apiUrl + `/api/tasks/${taskId}`)
      .pipe(catchError(response => this.handleError(response)));
  }

  public findProduct(productId: number, sn: string, pageIndex: number, pageSize: number, orderBy: string = 'ID', direction: string = 'DESC'): Observable<PaginationResponse<Task>> {

    let params = this.getQueryParams(sn, pageIndex, pageSize, orderBy, direction);
    params = (productId ? params.set('productId', JSON.stringify(productId)) : params);

    return this.http.get<PaginationResponse<Task>>(this.apiUrl + '/api/tasks/find', { params })
      .pipe(catchError(response => this.handleError(response)));
  }
}
