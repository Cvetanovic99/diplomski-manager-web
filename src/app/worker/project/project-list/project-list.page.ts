import { Component, OnInit } from '@angular/core';
import { Project } from '../../../_shared/models/Project/Project';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProjectService } from '../../../admin/project/services/project.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../../../admin/user/services/user.service';
import { ProjectState } from 'src/app/_shared/constants/Constants';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
})
export class ProjectListPage implements OnInit {

  loading = true;
  projects: Project[] = undefined;
  paginationConfig = {
    pageIndex: 0,
    pageSize: 10,
    total: undefined
  };

  editorModal;

  filter: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private projectService: ProjectService,
              private userService: UserService) { }

  ngOnInit(): void {

   this.buildFilter();
  }

  ionViewWillEnter() {

    this.fetchProjects();
  }

  ionViewDidLeave() {

    this.loading = false;
    this.editorModal = undefined;
  }

  fetchProjects() {
    this.loading = true;
    this.projectService.index(this.filter.controls.name.value,
                           this.paginationConfig.pageIndex, this.paginationConfig.pageSize,
                    'CreatedAt', 'DESC',
                           this.filter.controls.state.value as ProjectState).subscribe(
      result => {
        this.projects = result.items.map(project => ({
            ...project,
            stateIcon: this.projectService.getProjectStateIcon(project.state as ProjectState)
          }));

        this.paginationConfig.total = result.total;
      },
      error => {
        // TODO (handle-me)
      },
      () => this.loading = false
    );
  }

  changePage(next: boolean) {
    this.paginationConfig.pageIndex = (next ? this.paginationConfig.pageIndex + 1 : this.paginationConfig.pageIndex - 1);
    this.fetchProjects();
  }

  buildFilter() {

    this.filter = this.formBuilder.group({
      name: [''],
      state: ['U procesu']
    });

    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(value => {
        this.paginationConfig.pageIndex = 0;
        this.fetchProjects();
      });
  }
}
