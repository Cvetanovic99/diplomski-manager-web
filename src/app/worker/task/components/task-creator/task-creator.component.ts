import { Task } from '../../../../_shared/models/Task/Task';
import { ProductSwiper } from '../../../../_shared/models/productSwiper';
import { ProductState } from '../../../../_shared/models/Product/ProductState';
import { WarehouseService } from 'src/app/admin/warehouse/services/warehouse.service';
import { User } from '../../../../_shared/models/Auth/User';

import { AfterContentChecked, ApplicationRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../../../_shared/services/toast.service';
import { CreateTaskDto } from '../../../../_shared/models/Task/CreateTaskDto';
import { State } from '../../../../_shared/store';
import { Product } from '../../../../_shared/models/Product/Product';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import { ProductStateDto } from 'src/app/_shared/models/Product/ProductStateDto';
import { select, Store } from '@ngrx/store';
import { authUser } from 'src/app/auth/store/auth.selectors';


@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.component.html',
  styleUrls: ['./task-creator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCreatorComponent implements OnInit, AfterContentChecked {

  @Input() projectId: number;
  @Input() warehouseId: number;
  @Input() initialSlideIndex: number;

  @ViewChild('swiper') swiper: SwiperComponent;

  config: SwiperOptions = null;

  mainWorker: User;
  coworker: User;

  editorModal;
  filter: FormControl;


  editorForm: FormGroup;
  tempProductForm: FormGroup;

  editorFormActive = false;

  submitted = false;
  loading = false;

  pickedProduct: Product;
  pickedProductsHelperArray: Product[] = [];

  pickedProductState: ProductState;
  pickedProductQuantity = 0;

  productsSwiper: ProductSwiper[] = [];

  isProductWithSN         = true;
  isProductPicked         = false;
  isCoworkerPicked        = false;
  isUpdate                = false;

  isProuductQuantityAdded = false;


  get products(): FormArray {
    return this.editorForm.controls.products as FormArray;
  }

  constructor(private formBuilder: FormBuilder,
              private modalController: ModalController,
              private taskService: TaskService,
              private toastService: ToastService,
              private store: Store<State>,
              private warehouseService: WarehouseService,
              private appRef: ApplicationRef) { }


  /**
   * Lifecycle methods -------------------------------------------------------------------------------------------------
   */

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

    this.config = {
      slidesPerView: 1,
      allowTouchMove: false,
      initialSlide: 0
    };

    this.getUser();
  }


  getUser() {
    this.store
      .pipe(select(authUser))
      .subscribe(user => {

        this.mainWorker = user;
        this.buildEditorForm();
      });
  }

  /**
   * Forms -------------------------------------------------------------------------------------------------------------
   */

  buildEditorForm() {

    this.editorForm = this.formBuilder.group({
     id:             [null],
     projectId:      [this.projectId,     [Validators.required]],
     quantityUsed:   [1],
     employed1Id:    [this.mainWorker?.id, [Validators.required]],
     employed2Id:    [null,               []],

     products: this.formBuilder.array([])
   });

    this.editorFormActive = true;
  }



  addProductToFormArray(newProduct: Product, newProductState: ProductState): void {

      this.pickedProductsHelperArray.push(newProduct);

      const productFrom = this.formBuilder.group({
            productId:      [newProduct.id,       [Validators.required]],
            name:           [newProduct.name],
            productStateId: [newProductState.id,  [Validators.required]],
            quantityUsed:   [!newProduct.hasSN  ? newProductState.quantity : 1],
            sn:             [newProduct.hasSN   ? newProductState.sn : null],
      });

      if(this.pickedProduct.hasSN)
      {
        this.productsSwiper.push({
            productId: null,
            sn: newProductState.sn,
            hasSN: true,
            productStateId: newProductState.id
          } as unknown as ProductSwiper);
      }
      else
      {
        this.productsSwiper.push({
          productId: newProduct.id,
          sn: null,
          hasSN: false,
          productStateId: null
        } as unknown as ProductSwiper);
      }

      this.products.push(productFrom);

      this.pickedProduct      = undefined;
      this.pickedProductState = undefined;
  }

  /**
   * Slider routing ----------------------------------------------------------------------------------------------------
   */

  next() {
    this.swiper.swiperRef.slideNext();
  }

  prev(){
    if(this.swiper.swiperRef.realIndex === 3 && this.pickedProduct && this.pickedProduct.hasSN)
    {
      this.swiper.swiperRef.slideTo(1);
    }
    else if(this.swiper.swiperRef.realIndex === 2 && this.pickedProduct && !this.pickedProduct.hasSN)
    {
      this.swiper.swiperRef.slideTo(0);
    }
    else if(this.swiper.swiperRef.realIndex === 3 && !this.pickedProduct)
    {
      this.swiper.swiperRef.slideTo(0);
    }
    else
    {
      this.swiper.swiperRef.slidePrev();
    }
  }

  redirectToFirstPage(): void {
    this.editorForm.controls.quantityUsed.setValue(1);
    this.editorForm.controls.quantityUsed.updateValueAndValidity();
    this.redirectSliderTo(0);
  }

  redirectSliderTo(pageIndex: number): void {
    this.swiper.swiperRef.slideTo(pageIndex);
  }

  /**
   * Slider commands ---------------------------------------------------------------------------------------------------
   */

  onRemoveProduct(productIndex: number): void {

    this.products.removeAt(productIndex);
    this.productsSwiper.splice(productIndex,1);
    this.appRef.tick();
  }

  onProductPicked(newProduct: Product): void {

    this.pickedProduct = newProduct;
    this.pickedProductState = newProduct.states[0];


    if(!newProduct.hasSN)
    {

      this.editorForm.controls.quantityUsed.setValue(1);
      this.editorForm.controls.quantityUsed.setValidators(
        [Validators.required,Validators.min(1),Validators.max(newProduct.states[0].quantity)]
        );
      this.editorForm.controls.quantityUsed.updateValueAndValidity();
      this.pickedProductQuantity = newProduct.states[0].quantity;
    }

    if(this.pickedProduct.hasSN)
    {
      this.editorForm.controls.quantityUsed.setValue(1);
      this.editorForm.controls.quantityUsed.clearValidators();
      this.editorForm.controls.quantityUsed.updateValueAndValidity();
      this.swiper.swiperRef.slideNext();
    }
    else
    {
      this.isProductWithSN = true;
      this.swiper.swiperRef.slideTo(2);
    }
  }

  onPickSNCode(productSNCode: ProductStateDto): void {

    this.swiper.swiperRef.slideTo(3);
    this.pickedProductState = productSNCode;

    this.addProductToFormArray(this.pickedProduct,this.pickedProductState);


    this.swiper.swiperRef.slideTo(3);


    this.isProductWithSN = true;
    this.isProuductQuantityAdded = false;
  }

  onPickQuantity(): void {

    this.pickedProductState.quantity = this.editorForm.controls.quantityUsed.value;
    this.addProductToFormArray(this.pickedProduct,this.pickedProductState);


    this.next();
  }

  onPickCoworker(newCoworker: User): void {

    this.coworker = newCoworker;
    this.isCoworkerPicked = true;

    this.editorForm.controls.employed2Id.setValue(newCoworker.id);
    this.editorForm.controls.employed2Id.updateValueAndValidity();

    this.swiper.swiperRef.slideTo(this.swiper.swiperRef.slides.length - 1);

  }

  onNoCoworker(): void{

    this.coworker = null;
    this.isCoworkerPicked = false;

    this.editorForm.controls.employed2Id.setValue(null);
    this.editorForm.controls.employed2Id.updateValueAndValidity();

    this.swiper.swiperRef.slideTo(this.swiper.swiperRef.slides.length - 1);
  }

  /**
   * -------------------------------------------------------------------------------------------------------------------
   */

  onSubmit() {

    this.loading = true;

    const newTasks: CreateTaskDto[] = [];

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for(let i=0; i<this.products.length; i++)
    {

      const createTaskDto = {
        quantityUsed:   this.products.at(i).get('quantityUsed').value,
        productStateId: this.products.at(i).get('productStateId').value,
        sn:             this.products.at(i).get('sn').value,
        projectId:      this.editorForm.controls.projectId.value,
        employed1Id:    this.editorForm.controls.employed1Id.value,
        employed2Id:    this.editorForm.controls.employed2Id.value
      } as CreateTaskDto;

      newTasks.push(createTaskDto);
    }



      this.taskService.storeArray(newTasks).subscribe(
        result => {

            this.toastService.showSuccess('Odrađeni posao je uspešno dodat u sistem!');
            this.editorForm.reset();

            const newTasksFromResponse: Task[] = [];

            result.forEach( (newTask: any) => {

                const productForNewTask: Product = this.pickedProductsHelperArray
                .find( productFromArray => productFromArray.id === newTask.productState.productId);
                newTask.product = productForNewTask;

                newTasksFromResponse.push(newTask);
            });

            this.modalController.dismiss(newTasksFromResponse);

        },
        error => {
          // TODO handle error
          // this.toastService.showError(error);
        },
        ()=>{
          this.loading = false;
        }

      );
  }

  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
