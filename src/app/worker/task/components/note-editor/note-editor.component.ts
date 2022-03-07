import { AfterContentChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import { ToastService } from '../../../../_shared/services/toast.service';
import { State } from '../../../../_shared/store';
import { User } from '../../../../_shared/models/Auth/User';
import { Task } from '../../../../_shared/models/Task/Task';
import { TaskService } from '../../services/task.service';
import { authUser } from '../../../../auth/store/auth.selectors';
import { CreateTaskDto } from '../../../../_shared/models/Task/CreateTaskDto';
import { UpdateTaskDto } from '../../../../_shared/models/Task/UpdateTaskDto';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent implements OnInit, AfterContentChecked {


  @Input() task: Task | null;
  @Input() projectId: number;
  @Input() warehouseId: number;

  mainWorker: User = undefined;
  editorForm: FormGroup = undefined;
  editorFormActive = false;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('swiper') swiper: SwiperComponent;
  swiperConfig: SwiperOptions = undefined;

  loading = false;
  lastSlideVisited = false;

  coworker: User = undefined;

  constructor(private formBuilder: FormBuilder,
              private modalController: ModalController,
              private taskService: TaskService,
              private toastService: ToastService,
              private store: Store<State>) { }

  ngOnInit() {
    this.initializeComponent();
  }

  ngAfterContentChecked(): void {
    if(this.swiper)
    {
      this.swiper.updateSwiper({});
    }
  }

  initializeComponent() {
    this.getUser();
    this.coworker = this.task !== undefined && this.task.employed2 !== null ? this.task.employed2 : undefined;
    this.lastSlideVisited = !!this.task;
    this.swiperConfig = {
      slidesPerView: 1,
      allowTouchMove: false,
      initialSlide: this.task ? 2 : 0
    };
  }

  getUser() {
    this.store
      .pipe(select(authUser))
      .subscribe(user => {

        this.mainWorker = user;
        this.buildEditorForm(this.task);
      });
  }

  buildEditorForm(task?: Task) {
    this.editorForm = this.formBuilder.group({
      id:             [task ? task.id                                   : null],
      description:    [task ? task.description                          : '',                 [Validators.required]],
      employed1Id:    [task ? task.employed1?.id                         : this.mainWorker?.id, [Validators.required]],
      employed2Id:    [task && task.employed2 ? task.employed2.id       : null],
      projectId:      [this.projectId,                                                        [Validators.required]],
    });

    this.editorFormActive = true;
  }

  onCoworkerPicked(user?: User) {
    this.editorForm.controls.employed2Id.setValue(user ? user.id : null);
    this.editorForm.controls.employed2Id.updateValueAndValidity();
    this.coworker = user ? user : undefined;

    this.lastSlideVisited = true;
    this.lastSlide();
  }

  onSubmit() {

    this.loading = true;
    if (this.task === undefined) {
      this.taskService.store(this.editorForm.value as CreateTaskDto).subscribe(
        result => {

          this.toastService.showSuccess('Odrađeni posao je uspešno dodat u sistem!');
          this.editorForm.reset();

          const newTask: Task = result as Task;

          this.modalController.dismiss(newTask);
        },
        error => {
          this.toastService.showError(error.error.message);
        },
        () => this.loading = false
      );
    } else {
      this.taskService.update(this.editorForm.value as UpdateTaskDto).subscribe(
        result => {
          this.toastService.showSuccess('Odrađeni posao je uspešno ažuriran!');
          this.editorForm.reset();
          this.modalController.dismiss(result as Task);
        },
        error => {
          this.toastService.showError(error.error.message);
        },
        () => this.loading = false
      );
    }
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  redirectToSlideFromDescriptionSlide() {
    this.editorForm.controls.description.setValue(this.editorForm.controls.description.value);
    this.editorForm.controls.description.updateValueAndValidity();
    if(this.lastSlideVisited)
    {
      this.lastSlide();
    }
    else
    {
      this.nextSlide();
    }
  }

  nextSlide() {

    this.swiper.swiperRef.slideNext();
  }

  previousSlide() {
    this.swiper.swiperRef.slidePrev();
  }

  lastSlide() {
    this.swiper.swiperRef.slideTo(this.swiper.swiperRef.slides.length - 1);
  }
}
