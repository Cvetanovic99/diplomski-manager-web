import { ProductSwiper } from './../../../../_shared/models/productSwiper';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { WarehouseService } from 'src/app/admin/warehouse/services/warehouse.service';
import { Product } from 'src/app/_shared/models/Product/Product';

@Component({
  selector: 'app-product-swiper',
  templateUrl: './product-swiper.component.html',
  styleUrls: ['./product-swiper.component.scss'],
})
export class ProductSwiperComponent implements OnInit {

  @Input() isProductPicked = false;
  @Input() warehouseId:       number;
  @Input() isUpdate: boolean;
  @Input() productsSwiper: ProductSwiper[] = [];

  @Output() productEmmiter = new EventEmitter<Product>();
  @Output() taskDoesntRequreProductEmmiter = new EventEmitter();
  @Output() doneWithChangesEmmiter = new EventEmitter();
  @Output() dismissEmmiter = new EventEmitter();

  products:   Product[];

  filter: FormControl;
  pickerFormActive = false;
  submitted = false;
  loading = false;
  pickerPaginationConfig = {
    pageIndex: 0,
    pageSize: 5,
    total: undefined
  };

  constructor(private warehouseService: WarehouseService,
              private popoverController: PopoverController,
              private changeDetectionReference: ChangeDetectorRef) { }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.buildFilter();
  }

  buildFilter(): void {

    this.filter = new FormControl('');

    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(value => {
        this.pickerPaginationConfig.pageIndex = 0;
        this.fetchProducts();
      });

    this.fetchProducts();
  }

  changePage(next: boolean): void {
    this.pickerPaginationConfig.pageIndex = (next ? this.pickerPaginationConfig.pageIndex + 1 : this.pickerPaginationConfig.pageIndex - 1);

    this.fetchProducts();

  }

  pick(product: Product) {
     this.popoverController.dismiss(product);
  }

  taskDoesntRequreProduct(): void{
    this.taskDoesntRequreProductEmmiter.emit();
  }

  private fetchProducts() {
    this.loading = true;
    this.warehouseService.productsForTask(this.warehouseId,
                                          this.filter.value,
                                          this.pickerPaginationConfig.pageIndex,
                                          this.pickerPaginationConfig.pageSize)
      .subscribe(
        result => {
          this.products = result.items;
          this.pickerPaginationConfig.total = result.total;

          this.loading = false;
          this.changeDetectionReference.detectChanges();
        },
        error =>{
          //TODO: add error handler
        },
        () => this.loading = false
      );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  checkIfProductIsPickedBefore(product: Product): boolean {

    const index = this.productsSwiper.findIndex(productSwiper => !productSwiper.hasSN && productSwiper.productId === product.id);

    if(index === -1)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  addProduct(product: Product): void
  {
    const newProduct = JSON.parse(JSON.stringify(product));
    this.productEmmiter.emit(newProduct);
    this.pickerPaginationConfig.pageIndex = 0;
    this.fetchProducts();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  doneWithChanges(): void
  {
    this.doneWithChangesEmmiter.emit();
    this.pickerPaginationConfig.pageIndex = 0;
    this.fetchProducts();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  dismiss(): void {
    this.dismissEmmiter.emit();
  }


}
