import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../../../_shared/models/PaginationResponse';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from '../../../_shared/services/base-api.service';
import { Project } from 'src/app/_shared/models/Project/Project';
import { CreateProjectDto } from '../../../_shared/models/Project/CreateProjectDto';
import { UpdateProjectDto } from '../../../_shared/models/Project/UpdateProjectDto';
import { Task } from '../../../_shared/models/Task/Task';
import { ProjectState } from '../../../_shared/constants/Constants';
import { Icon } from '../../../_shared/helpers/Icon';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseApiService {

  projectStates = ProjectState;

  // eslint-disable-next-line max-len
  public index(filter: string, pageIndex: number, pageSize: number, orderBy: string = 'ID', direction: string = 'DESC', state?: ProjectState): Observable<PaginationResponse<Project>> {

    let params = this.getQueryParams(filter, pageIndex, pageSize, orderBy, direction);

    params = (state ? params.set('state', state) : params);

    return this.http.get<PaginationResponse<Project>>(this.apiUrl + '/api/projects', { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  public show(projectId: number): Observable<Project> {
    return this.http.get<Project>(this.apiUrl + `/api/projects/${projectId}`)
      .pipe(catchError(response => this.handleError(response)));
  }

  public store(project: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(this.apiUrl + '/api/projects', project)
      .pipe(catchError(response => this.handleError(response)));
  }

  public update(project: UpdateProjectDto): Observable<Project> {
    return this.http.put<Project>(this.apiUrl + `/api/projects/${project.id}`, project)
      .pipe(catchError(response => this.handleError(response)));
  }

  public destroy(projectId: number): Observable<any> {

    return this.http.delete(this.apiUrl + `/api/projects/${projectId}`)
      .pipe(catchError(response => this.handleError(response)));
  }

  public tasks(projectId: number, userId: number =null, pageIndex: number, pageSize: number,
    orderBy: string = 'CreatedAt', direction: string = 'DESC'): Observable<PaginationResponse<Task>> {

    let params = this.getQueryParams(null, pageIndex, pageSize, orderBy, direction);
    params = (userId ? params.set('userId', userId) : params);

    return this.http.get<PaginationResponse<Task>>(this.apiUrl + `/api/projects/${projectId}/tasks`, { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  public getProjectStateIcon(state: ProjectState): Icon {

    switch (state) {
      case this.projectStates.inProgress:
        return {
          name: 'hourglass-outline',
          color: 'warning'
        } as Icon;
      case this.projectStates.complete:
        return {
          name: 'checkmark-circle-outline',
          color: 'success'
        } as Icon;
      case this.projectStates.postponed:
        return {
          name: 'alert-circle-outline',
          color: 'warning'
        } as Icon;
      case this.projectStates.givenUp:
        return {
          name: 'close-circle-outline',
          color: 'danger'
        } as Icon;
        case this.projectStates.notFinished:
          return {
            name: 'infinite-outline',
            color: 'danger'
          } as Icon;
    }
  }

}
