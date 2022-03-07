import { ProductState } from './../../../../_shared/models/Product/ProductState';
import { AfterContentChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { State } from '../../../../_shared/store';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { SwiperComponent } from 'swiper/angular';
import { TaskService } from '../../services/task.service';
import { UpdateTaskDto } from 'src/app/_shared/models/Task/UpdateTaskDto';
import { Task } from 'src/app/_shared/models/Task/Task';
import { authUser } from 'src/app/auth/store/auth.selectors';
import { User } from 'src/app/_shared/models/Auth/User';
import { SwiperOptions } from 'swiper';
import { Product } from 'src/app/_shared/models/Product/Product';
import { WarehouseService } from 'src/app/admin/warehouse/services/warehouse.service';
import { ProductStateDto } from 'src/app/_shared/models/Product/ProductStateDto';

@Component({
  selector: 'app-single-task-editor',
  templateUrl: './single-task-editor.component.html',
  styleUrls: ['./single-task-editor.component.scss'],
})
export class SingleTaskEditorComponent implements OnInit, AfterContentChecked {

  /**
   * Stranice slider-a
   *
   * 0 - dodaj proizvod
   * 1 - dodaj sn
   * 2 - dodaj kolicinu
   * 3 - dodaj radnika
   * 4 - submit
   */

  @ViewChild('swiper') swiper: SwiperComponent;

  @Input() task: Task | null;
  @Input() projectId: number;
  @Input() warehouseId: number;

  mainWorker: User = undefined;
  coworker: User = undefined;

  lastSlideVisited = false;
  editorForm: FormGroup = undefined;
  editorFormActive = false;
  loading = false;

  product: Product;
  productState: ProductState;

  productQuantity = 0;


  swiperConfig: SwiperOptions = undefined;

  constructor(private formBuilder: FormBuilder,
              private modalController: ModalController,
              private taskService: TaskService,
              private warehouseService: WarehouseService,
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
    this.getProductQuantityLeft();

    this.coworker = this.task !== undefined && this.task.employed2 !== null ? this.task.employed2 : undefined;
    // this.lastSlideVisited = !!this.task;

    this.swiperConfig = {
      slidesPerView: 1,
      allowTouchMove: false,
      initialSlide: 4
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

  /**
   * Api calls ---------------------------------------------------------------------------------------------------------
   */

  getProductQuantityLeft(): void {

    this.warehouseService.productForTask(this.warehouseId,this.task.product.id).subscribe(
      result => {

        this.productQuantity = result.quantity;

        const quantityValidators =
        [Validators.required, Validators.min(1), Validators.max((this.task ? this.task.quantityUsed : 0) + this.productQuantity)];

        this.editorForm.controls.quantityUsed.setValidators(quantityValidators);
      }
    );
 }



  buildEditorForm(task?: Task) {

    const quantityValidators = [Validators.required, Validators.min(1)];

    this.editorForm = this.formBuilder.group({
      id:             [task ? task.id                                   : null],
      quantityUsed:   [task ? task.quantityUsed                         : 1, task ?   quantityValidators  : []],
      description:    [task ? task.description                          : '',                 []],
      productStateId: [task && task.productState ? task.productState.id : null,               []],
      sn:             [task ? task.sn                                   : null,               []],
      projectId:      [this.projectId,                                                        [Validators.required]],
      employed1Id:    [task && task.employed1?.id ? task.employed1.id   : this.mainWorker.id, [Validators.required]],
      employed2Id:    [task && task.employed2?.id ? task.employed2.id   : null,               []],
    });

    this.product = this.task.product;
    this.productState = this.task.productState as ProductStateDto;
    this.mainWorker = this.task.employed1;
    this.coworker = this.task.employed2;

    this.editorFormActive = true;
  }



  //////////////      PRODUCT       ////////////////////////

  onProductPicked(newProduct: Product): void {

    this.product = newProduct;
    this.productState = newProduct.states[0];

    if(!newProduct.hasSN)
    {
      this.editorForm.controls.sn.setValue(null);
      this.editorForm.controls.sn.setValidators([]);
      this.editorForm.controls.sn.updateValueAndValidity();

      this.editorForm.controls.productStateId.setValue(newProduct.states[0].id);
      this.editorForm.controls.productStateId.updateValueAndValidity();

      const quantityValidators = [Validators.required, Validators.min(1), Validators.max(newProduct.states[0].quantity)];

      this.productQuantity = newProduct.states[0].quantity;
      this.editorForm.controls.quantityUsed.setValidators(quantityValidators);
      this.editorForm.controls.quantityUsed.updateValueAndValidity();

      this.swiper.swiperRef.slideTo(2);
    }

    else if(this.product.hasSN)
    {
      this.editorForm.controls.sn.setValidators([Validators.required]);
      this.editorForm.controls.sn.updateValueAndValidity();

      this.swiper.swiperRef.slideNext();
    }
  }

  //////////////PRODUCT WITH SN////////////////////////

  onPickSNCode(productSNCode: ProductStateDto): void {

    this.productState = productSNCode;

    this.editorForm.controls.productStateId.setValue(productSNCode.id);
    this.editorForm.controls.productStateId.updateValueAndValidity();

    this.editorForm.controls.sn.setValue(productSNCode.sn);
    this.editorForm.controls.sn.updateValueAndValidity();

    this.editorForm.controls.quantityUsed.setValue(1);
    this.editorForm.controls.quantityUsed.updateValueAndValidity();

    if(this.task)
      {
        this.swiper.swiperRef.slideTo(5);
      }
      else
      {
        this.swiper.swiperRef.slideTo(3);
      }
  }

  //////////////PRODUCT WITH SN////////////////////////
  redirectToCoworker(donwWithChanges: boolean): void {

    this.editorForm.controls.quantityUsed.setValue(this.editorForm.controls.quantityUsed.value);
    this.editorForm.controls.quantityUsed.updateValueAndValidity();


    if(donwWithChanges)
    {
      this.swiper.swiperRef.slideTo(4);
    }
    else
    {
      this.swiper.swiperRef.slideTo(3);
    }

  }

  //////////////COWORKER////////////////////////

  onPickCoworker(newCoworker: User): void {

    this.coworker = newCoworker;

    this.editorForm.controls.employed2Id.setValue(newCoworker.id);
    this.editorForm.controls.employed2Id.updateValueAndValidity();

    this.swiper.swiperRef.slideTo(5);
  }

  onNoCoworker(): void{

    this.coworker = null;

    this.editorForm.controls.employed2Id.setValue(null);
    this.editorForm.controls.employed2Id.updateValueAndValidity();

    if(this.product)
    {
      this.editorForm.controls.description.clearValidators();
      this.editorForm.controls.description.updateValueAndValidity();
    }

    this.swiper.swiperRef.slideTo(4);
  }


  //////////////SUBMIT////////////////////////

  onSubmit() {

    this.loading = true;

      this.taskService.update(this.editorForm.value as UpdateTaskDto).subscribe(
        result => {
          this.toastService.showSuccess('Odrađeni posao je uspešno ažuriran!');
          this.editorForm.reset();

          const newTask: Task = result as Task;
          newTask.product = this.product;

          this.modalController.dismiss(newTask);
        },
        error => {
          this.toastService.showError(error.error.message);
        },
        () => this.loading = false
      );

  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  nextSlide() {
    this.swiper.swiperRef.slideNext();
  }

  previousSlide() {

      if(this.swiper.swiperRef.realIndex === 3 && this.product && this.product.hasSN)
      {
        this.swiper.swiperRef.slideTo(1);
      }
      else if(this.swiper.swiperRef.realIndex === 2 && this.product && !this.product.hasSN)
      {
        this.swiper.swiperRef.slideTo(0);
      }
      else if(this.swiper.swiperRef.realIndex === 3 && !this.product)
      {
        this.swiper.swiperRef.slideTo(0);
      }
      else
      {
        this.swiper.swiperRef.slidePrev();
      }

  }

  redirectTo(pageIndex: number): void {

    this.swiper.swiperRef.slideTo(pageIndex);
  }

  lastSlide() {
    this.swiper.swiperRef.slideTo(this.swiper.swiperRef.slides.length - 1);
  }

}
