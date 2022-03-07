import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Product } from 'src/app/_shared/models/Product/Product';
import { WarehouseService } from '../../services/warehouse.service';

@Component({
  selector: 'app-product-picker',
  templateUrl: './product-picker.component.html',
  styleUrls: ['./product-picker.component.scss'],
})
export class ProductPickerComponent implements OnInit {

  @Input() isNew:    boolean | null;
  @Input() warehouseId:       number;
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
              private popoverController: PopoverController) { }

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

  private fetchProducts() {
    this.loading = true;
    this.warehouseService.nonExistentproducts
                                  (this.warehouseId,
                                  this.filter.value,
                                  this.pickerPaginationConfig.pageIndex,
                                  this.pickerPaginationConfig.pageSize)
      .subscribe(
        result => {
          this.products = result.items;
          this.pickerPaginationConfig.total = result.total;
        },
        error =>{
          //TODO: add error handler
        },
        () => this.loading = false
      );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  dismiss(): void {
    this.popoverController.dismiss({
      dismissed: true
    });
  }

}
