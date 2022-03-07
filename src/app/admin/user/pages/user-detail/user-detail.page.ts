import { ToolsEditorComponent } from './../../components/tools-editor/tools-editor.component';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from '../../../../_shared/models/Auth/User';
import { UserService } from '../../services/user.service';
import * as moment from 'moment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CreateReportDto } from '../../../../_shared/models/CreateReportDto';
import { Project } from '../../../../_shared/models/Project/Project';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {

  user: User;
  // tasks: Task[];
  loading = 0;
  paginationConfig = {
    pageSize: 10,
    pageIndex: 0,
    total: undefined
  };
  excelFrom: FormGroup;
  projects: Project[];
  doneProjects: Project[];

  editorModal;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private modalController: ModalController
              ) {
  }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has('userId')) {
        const userId = params.get('userId');
        this.buildExcelForm();
        this.fetchUser(userId);
      } else {
        // add toast nije moguce pronaci magacin
        this.router.navigate(['/admin/radnici']);
      }
    });
  }

  fetchUser(userId) {
    this.loading++;
    this.userService.show(userId).subscribe(
      result => {
        this.user = result;
        this.fetchWebReport();
        this.fetchProjects();
        // this.fetchTasks();
      },
      error => {
        // TODO (handle-me)
      },
      () => this.loading--
    );
  }

  fetchReport() {

    const createReportDto = {
      start: moment(this.excelFrom.controls.start.value).format('yyyy-MM-DD'),
      end: moment(this.excelFrom.controls.end.value).format('yyyy-MM-DD'),
      projectId: this.excelFrom.controls.projectId.value
    } as CreateReportDto;

    this.userService.report(this.user.id, createReportDto).subscribe(
      result => {
        const source = `data:application/vnd.ms-excel;base64,${result}`;
        const link = document.createElement('a');
        link.href = source;
        link.download = `${this.user.name}-${this.user.surname}.xlsx`;
        link.click();
      },
      error => {
        // TODO (handle-me)
      }
    );
  }

  fetchWebReport() {

    const createReportDto = {
      start: moment(this.excelFrom.controls.start.value).format('yyyy-MM-DD'),
      end: moment(this.excelFrom.controls.end.value).format('yyyy-MM-DD'),
      projectId: this.excelFrom.controls.projectId.value
    } as CreateReportDto;

    this.userService.webReport(this.user.id, createReportDto, this.paginationConfig.pageIndex, this.paginationConfig.pageSize).subscribe(
      result => {
        this.doneProjects = result.projects.map(project => {
          return {
              ...project,
              tasks: project.tasks.map(task => {
                return {
                  ...task,
                  createdAt: moment(task.createdAt).format('MMMM Do YYYY')
                };
              }),
          } as Project;
        });
      },
      error => {
        // TODO (handle-me)
      }
    );
  }

  changePage(next: boolean) {
    this.paginationConfig.pageIndex = (next ? this.paginationConfig.pageIndex + 1 : this.paginationConfig.pageIndex - 1);
    this.fetchWebReport();
  }

  async openEditor() {

    this.editorModal = await this.modalController.create({
      component: ToolsEditorComponent,
      componentProps: {
        user: this.user
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-shadow
    this.editorModal.onDidDismiss().then((user: any) => {


      if(user.data?.dismissed)
      {
        return;
      }


      if(user.data !== undefined)
      {
          this.user.tools = user.data.tools;
      }
    });

    return await this.editorModal.present();
  }

  buildExcelForm() {
    const start = moment().startOf('month').format('YYYY-MM-DD hh:mm');
    const end = moment().add(1,'days').format('YYYY-MM-DD hh:mm');

    this.excelFrom = this.formBuilder.group({
      start: [start, Validators.required],
      end: [end, Validators.required],
      projectId: [null]
    });

    this.excelFrom.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(value => {

        this.fetchWebReport();
      });
  }

  fetchProjects() {
    this.userService.allProjects(this.user.id).subscribe(
      result => {
        this.projects = result;
      },
      error => {
        // TODO (handle-me)
      }
    );
  }


}
