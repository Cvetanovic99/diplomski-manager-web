import { Component, OnInit } from '@angular/core';
import {Project} from '../../../../_shared/models/Project/Project';
import {Task} from '../../../../_shared/models/Task/Task';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController, PopoverController} from '@ionic/angular';
import {ProjectService} from '../../services/project.service';
import * as moment from 'moment';
import { ProjectEditorComponent } from '../../components/project-editor/project-editor.component';
import { Icon } from '../../../../_shared/helpers/Icon';
import { ProjectState } from '../../../../_shared/constants/Constants';
import { DeletePickerComponent } from 'src/app/_shared/components/delete-picker/delete-picker.component';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { TaskService } from 'src/app/worker/task/services/task.service';
import 'moment/locale/sr';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.page.html',
  styleUrls: ['./project-detail.page.scss'],
})
export class ProjectDetailPage implements OnInit {

  project: Project;
  stateIcon: Icon;
  tasks: Task[];
  loading = 0;
  paginationConfig = {
    pageSize: 10,
    pageIndex: 0,
    total: undefined
  };

  editorModal;
  deletePicker;


  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private modalController: ModalController,
              private pickerDeleteController: PopoverController,
              private toastService: ToastService,
              private taskService: TaskService,
              private projectService: ProjectService) {
  }

  ngOnInit() {

    moment.locale('SR');
    this.initializeComponent();
  }

  initializeComponent(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has('projectId')) {
        const projectId = params.get('projectId');
        this.fetchProject(projectId);
      } else {
        // add toast nije moguce pronaci magacin
        this.router.navigate(['/admin/projekti']);
      }
    });
  }

  fetchProject(projectId) {
    this.loading++;
    this.projectService.show(projectId).subscribe(
      result => {
        this.project = result;
        this.stateIcon = this.projectService.getProjectStateIcon(this.project.state as ProjectState);
        this.fetchTasks();
      },
      error => {
        // TODO (handle-me)
      },
      () => this.loading--
    );
  }

  fetchTasks() {
    this.loading++;
    this.projectService.tasks(this.project.id, null, this.paginationConfig.pageIndex, this.paginationConfig.pageSize).subscribe(
      result => {
        console.log(result);
        this.tasks = result.items.map(task => {
          return {
            ...task,
            createdAt: moment(task.createdAt).format('llll A')
          } as Task;
        });
        this.paginationConfig.total = result.total;
      },
      error => {
        // TODO handle me
      },
      () => this.loading--
    );
  }

  async deleteTask(event, taskId?: number) {
    event.stopPropagation();

    this.deletePicker = await this.pickerDeleteController.create({
      component: DeletePickerComponent,
      componentProps : {}
    });

    this.deletePicker.onDidDismiss().then((chose: any) => {

        if(chose.data)
        {
          const index = this.tasks.findIndex( task => task.id === taskId);
          this.taskService.destroy(taskId).subscribe(
            result =>{
              this.toastService.showSuccess('Odrađeni posao je uspešno obrisan!');
              this.fetchTasks();
            }
          );
        }

    });

    return await this.deletePicker.present();
  }

  changePage(next: boolean) {
    this.paginationConfig.pageIndex = (next ? this.paginationConfig.pageIndex + 1 : this.paginationConfig.pageIndex - 1);
    this.fetchTasks();
  }

  async openEditor(project?: Project) {
    this.editorModal = await this.modalController.create({
      component: ProjectEditorComponent,
      componentProps: {
        project
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-shadow
    this.editorModal.onDidDismiss().then((project: any) => {

      if(project.data?.dismissed)
      {
        return;
      }

      if(project.data !== undefined)
      {
        this.project = project.data;
        this.stateIcon = this.projectService.getProjectStateIcon(this.project.state as ProjectState);}
    });

    return await this.editorModal.present();
  }
}
