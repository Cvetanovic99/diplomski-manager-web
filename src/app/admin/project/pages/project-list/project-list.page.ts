import { ProjectEditorComponent } from '../../components/project-editor/project-editor.component';
import { Project } from '../../../../_shared/models/Project/Project';
import { ProjectService } from '../../services/project.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { ProjectState } from '../../../../_shared/constants/Constants';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
})
export class ProjectListPage implements OnInit{

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
              private modalController: ModalController) { }

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
        this.projects = result.items.map(project => {
          return {
            ...project,
            stateIcon: this.projectService.getProjectStateIcon(project.state as ProjectState)
          };
        });
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

  async openEditor() {
    this.editorModal = await this.modalController.create({
      component: ProjectEditorComponent
    });

    // eslint-disable-next-line @typescript-eslint/no-shadow
    this.editorModal.onDidDismiss().then((project: any) => {

      if(project.data?.dismissed)
      {
        return;
      }

      if(project.data.result !== undefined)
      {

        const checkIfProjectExist: Project = this.projects.find(x => x.id === project.data.result.id);
        if(checkIfProjectExist===undefined)
        {
          this.paginationConfig.total++;
          if(this.projects.length<this.paginationConfig.pageSize)
          {
            project.data.result.stateIcon = this.projectService.getProjectStateIcon(project.data.result.state as ProjectState);
            this.projects.push(project.data.result as Project);
          }
        }
      }
      if(project.data !== undefined)
      {
        const index = this.projects.findIndex(projectIndex => projectIndex.id === project.data.id);
        if(index!==-1)
        {
          this.projects[index] = project.data;
        }
      }
    });

    return await this.editorModal.present();
  }

  buildFilter() {

    this.filter = this.formBuilder.group({
      name: [''],
      state: ['']
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
