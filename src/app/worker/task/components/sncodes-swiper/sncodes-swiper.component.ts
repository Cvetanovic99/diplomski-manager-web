import { Warehouse } from './../../../../_shared/models/Warehouse/Warehouse';
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { WarehouseService } from 'src/app/admin/warehouse/services/warehouse.service';
import { ProductStateDto } from 'src/app/_shared/models/Product/ProductStateDto';
import { ProductSwiper } from 'src/app/_shared/models/productSwiper';
import { Product } from 'src/app/_shared/models/Product/Product';

@Component({
  selector: 'app-sncodes-swiper',
  templateUrl: './sncodes-swiper.component.html',
  styleUrls: ['./sncodes-swiper.component.scss']
})
export class SncodesSwiperComponent implements OnInit, OnChanges {

  @Input()  productId:   number;
  @Input()  warehouseId: number;
  @Input()  isUpdate: boolean;
  @Input()  isProductWithSN: boolean;
  @Input()  productsSwiper: ProductSwiper[] = [];

  @Output() productSNCodeEmmiter = new EventEmitter<ProductStateDto>();
  @Output() doneWithChangesEmmiter = new EventEmitter();
  @Output() dismissEmmiter = new EventEmitter();
  @Output() slideToPreviousEmmiter = new EventEmitter();

  loading = false;

  paginationConfig = {
    pageSize: 5,
    pageIndex: 0,
    total: undefined
  };

  editorModal;
  filter:   FormControl;
  snCodes:  ProductStateDto[] = undefined;

  show = false;

  constructor(private warehouseService: WarehouseService, private changeDetectionReference: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {

      this.initializeComponent();
  }

  ngOnInit(){
    this.initializeComponent();
  }


  initializeComponent() {
    if(this.productId && this.warehouseId)
    {
      this.buildFilter();
    }
  }

  async fetchSNCodes() {
    this.loading = true;
    this.warehouseService.snCodesIndex
      (this.productId,this.warehouseId,this.filter.value, this.paginationConfig.pageIndex, this.paginationConfig.pageSize).subscribe(
      result => {
        this.snCodes = result.items;
        this.paginationConfig.total = result.total;

        this.show = true;
        this.loading = false;
        this.changeDetectionReference.detectChanges();
      },
      error => {
        // TODO (handle-me)
      },
      () => {
        this.loading = false;
      }
    );
  }

  buildFilter() {

    this.filter = new FormControl('');
    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(value => {
        this.paginationConfig.pageIndex = 0;
        this.fetchSNCodes();
      });

      this.fetchSNCodes();
  }

  changePage(next: boolean) {
    this.paginationConfig.pageIndex = (next ? this.paginationConfig.pageIndex + 1 : this.paginationConfig.pageIndex - 1);
    this.fetchSNCodes();
  }

  getSNCode(productSNCode: ProductStateDto)
  {
    this.productSNCodeEmmiter.emit(productSNCode);
  }

  doneWithChanges(): void {
    this.doneWithChangesEmmiter.emit();
  }

  checkIfSNCodeIsPickedBefore(product: ProductStateDto): boolean {

    const index =this.productsSwiper.findIndex(productSwiper => productSwiper.hasSN &&
                                                                productSwiper.sn === product.sn &&
                                                                productSwiper.productStateId === product.id);
    if(index === -1)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  dismiss(): void{
    this.dismissEmmiter.emit();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  prev(): void {
    this.slideToPreviousEmmiter.emit();
  }



}
