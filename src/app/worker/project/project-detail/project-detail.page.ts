import { SingleTaskEditorComponent } from './../../task/components/single-task-editor/single-task-editor.component';
import { TaskService } from './../../task/services/task.service';
import { DeletePickerComponent } from '../../../_shared/components/delete-picker/delete-picker.component';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../_shared/models/Project/Project';
import { ProjectService } from '../../../admin/project/services/project.service';
import { Task } from '../../../_shared/models/Task/Task';
import { ModalController, PickerController, PopoverController } from '@ionic/angular';
import { TaskCreatorComponent } from '../../task/components/task-creator/task-creator.component';
import { Icon } from '../../../_shared/helpers/Icon';
import * as moment from 'moment';
import { ProjectState } from '../../../_shared/constants/Constants';
import { ToastService } from 'src/app/_shared/services/toast.service';
import {select, Store} from '@ngrx/store';
import {State} from '../../../_shared/store';
import {User} from '../../../_shared/models/Auth/User';
import {authUser} from '../../../auth/store/auth.selectors';
import {NoteEditorComponent} from '../../task/components/note-editor/note-editor.component';
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
  noteEditorModal;
  singleTaskEditorModal;
  deleteTaskPicker;

  user: User;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private modalController: ModalController,
              private pickerDeleteController: PopoverController,
              private store: Store<State>,
              private projectService: ProjectService,
              private taskService: TaskService,
              private toastService: ToastService) {  }

  ngOnInit() {

    this.initializeComponent();
  }

  initializeComponent(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has('projectId')) {
        const projectId = params.get('projectId');
        this.fetchProduct(projectId);
      } else {
        // add toast nije moguce pronaci magacin
        this.router.navigate(['/radnik/projekti']);
      }
    });

    this.store
      .pipe(select(authUser))
      .subscribe(user => this.user = user);
  }

  fetchProduct(projectId) {
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
    this.projectService.tasks(this.project.id, this.user.id, this.paginationConfig.pageIndex, this.paginationConfig.pageSize).subscribe(
      result => {
        this.tasks = result.items.map(task => ({
            ...task,
            createdAt: moment(task.createdAt).format('llll A')
          } as Task));
        this.paginationConfig.total = result.total;
      },
      error => {
        // TODO handle me
      },
      () => this.loading--
    );
  }

  changePage(next: boolean) {
    this.paginationConfig.pageIndex = (next ? this.paginationConfig.pageIndex + 1 : this.paginationConfig.pageIndex - 1);
    this.fetchTasks();
  }

  async openDoneEditor(task?: Task) {
    this.editorModal = await this.modalController.create({
      component: TaskCreatorComponent,
      componentProps: {
        task,
        projectId: this.project.id,
        warehouseId: this.project.warehouse.id
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-shadow
    this.editorModal.onDidDismiss().then((taskArray: any) => {


      if(taskArray.data?.dismissed)
      {
        return;
      }

      if(taskArray.data !== undefined)
      {

        taskArray.data.forEach((newTask: Task) => {

          const date: Date = newTask.createdAt as unknown as Date;
          moment.locale('sr');
          newTask.createdAt = moment(newTask.createdAt).format('llll A');

          this.paginationConfig.total++;


          if(this.tasks.length<this.paginationConfig.pageSize)
          {
            this.tasks.unshift(newTask);
          }
          else
          {
            this.tasks.pop();
            this.tasks.unshift(newTask);
          }

        });

      }
    });

    return await this.editorModal.present();
  }

  async deleteTask(event, taskId?: number) {
    event.stopPropagation();

    this.deleteTaskPicker = await this.pickerDeleteController.create({
      component: DeletePickerComponent,
      componentProps : {}
    });

    this.deleteTaskPicker.onDidDismiss().then((chose: any) => {

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

    return await this.deleteTaskPicker.present();
  }


  async openNoteEditor(task?: Task) {

    this.noteEditorModal = await this.modalController.create({
      component: NoteEditorComponent,
      componentProps: {
        task,
        projectId: this.project.id,
        warehouseId: this.project.warehouse.id
      }
    });

    this.noteEditorModal.onDidDismiss().then((newTask: any) => {


      if(newTask.data?.dismissed)
      {
        return;
      }

      if(newTask.data !== undefined)
      {

        const checkIfTasktExist: Task = this.tasks.find(x => x.id === newTask.data.id);

        newTask.data.createdAt = moment(newTask.data.createdAt).format('llll A');

        if(checkIfTasktExist===undefined)
        {
          this.paginationConfig.total++;
          if(this.tasks.length<this.paginationConfig.pageSize)
          {
            this.tasks.unshift(newTask.data);
          }
          else
          {
            this.tasks.pop();
            this.tasks.unshift(newTask.data);
          }
        }
        else{
          const index = this.tasks.findIndex(taskFind => taskFind.id === newTask.data.id);
          this.tasks[index] = newTask.data;
        }


      }
    });

    return await this.noteEditorModal.present();
  }

  async openSlingleTaskEditor(task?: Task) {

    this.singleTaskEditorModal = await this.modalController.create({
      component: SingleTaskEditorComponent,
      componentProps: {
        task,
        projectId: this.project.id,
        warehouseId: this.project.warehouse.id
      }
    });

    this.singleTaskEditorModal.onDidDismiss().then((editedTask: any) => {


      if(editedTask.data?.dismissed)
      {
        return;
      }

      if(editedTask.data)
      {
        const index = this.tasks.findIndex(taskFind => taskFind.id === editedTask.data.id);
        this.tasks[index] = editedTask.data;
      }
    });

    return await this.singleTaskEditorModal.present();
  }

  openEditor(task: Task) {
    if (task.description !== null && task.description !== '') {
      this.openNoteEditor(task);
    }
    else {
      this.openDoneEditor(task);
    }
  }

}
