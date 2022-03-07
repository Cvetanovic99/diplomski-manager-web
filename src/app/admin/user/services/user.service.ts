import { UpdateUserTools } from './../../../_shared/models/UserUpdateTools';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../_shared/services/base-api.service';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../../../_shared/models/PaginationResponse';
import { catchError } from 'rxjs/operators';
import { User } from '../../../_shared/models/Auth/User';
import {Project} from '../../../_shared/models/Project/Project';
import {CreateReportDto} from '../../../_shared/models/CreateReportDto';
import {WebReportDto} from '../../../_shared/models/WebReportDto';
import {UpdateUserDto} from '../../../_shared/models/Auth/UpdateUserDto';
import {SetPasswordDto} from "../../../_shared/models/Auth/SetPasswordDto";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService {

  public index(filter: string, pageIndex: number, pageSize: number, orderBy: string = 'ID',
               direction: string = 'DESC'): Observable<PaginationResponse<User>> {

    const params = this.getQueryParams(filter, pageIndex, pageSize, orderBy, direction);

    return this.http.get<PaginationResponse<User>>(this.apiUrl + '/api/users', { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  public show(userId: number): Observable<User> {
    return this.http.get<User>(this.apiUrl + `/api/users/${userId}`)
      .pipe(catchError(response => this.handleError(response)));
  }

  public projects(filter: string, pageIndex: number, pageSize: number, orderBy: string = 'ID',
                  direction: string = 'DESC', state?: string): Observable<PaginationResponse<Project>> {

    let params = this.getQueryParams(filter, pageIndex, pageSize, orderBy, direction);

    params = (state ? params.set('state', state) : params);

    return this.http.get<PaginationResponse<Project>>(this.apiUrl + '/api/users/projects', { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  public report(userId: number, createReportDto: CreateReportDto): Observable<string> {

    const params = this.getCreateReportParameters(createReportDto);

    return this.http.get<string>(this.apiUrl + `/api/users/${userId}/report`, { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  public allProjects(userId: number): Observable<Project[]> {

    return this.http.get<Project[]>(this.apiUrl + `/api/users/${userId}/all-projects`)
      .pipe(catchError(response => this.handleError(response)));
  }

  public webReport(userId: number, createReportDto: CreateReportDto,
                   pageIndex: number, pageSize: number, orderBy: string = 'ID', direction: string = 'DESC'): Observable<WebReportDto> {

    let params = this.getQueryParams(null, pageIndex, pageSize, orderBy, direction);
    params = this.getCreateReportParameters(createReportDto, params);

    return this.http.get<WebReportDto>(this.apiUrl + `/api/users/${userId}/web-report`, { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  // public store(user: User): Observable<User> {
  //   return this.http.post<User>(this.apiUrl + '/api/users', user)
  //     .pipe(catchError(response => this.handleError(response)));
  // }

  public update(user: UpdateUserDto): Observable<any> {
    return this.http.put<any>(this.apiUrl + `/api/users/${user.id}`, user)
      .pipe(catchError(response => this.handleError(response)));
  }

  public setPassword(userId: number, setPasswordDto: SetPasswordDto): Observable<any> {
    return this.http.put<any>(this.apiUrl + `/api/users/${userId}/password`, setPasswordDto)
      .pipe(catchError(response => this.handleError(response)));
  }

  public updateTools(user: UpdateUserTools): Observable<any> {
    return this.http.put<any>(this.apiUrl + `/api/users/${user.id}/tools`, user)
      .pipe(catchError(response => this.handleError(response)));
  }

  public colleagues(userId: number,filter: string, pageIndex: number, pageSize: number, orderBy: string = 'ID',
  direction: string = 'DESC')
  {
    const params = this.getQueryParams(filter, pageIndex, pageSize, orderBy, direction);

    return this.http.get<any>(this.apiUrl + `/api/users/${userId}/colleagues`,  { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  // public destroy(userId: number): Observable<any> {
  //
  //   return this.http.delete(this.apiUrl + `/api/users/${userId}`)
  //     .pipe(catchError(response => this.handleError(response)));
  // }
}
