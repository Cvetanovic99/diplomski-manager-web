import { Warehouse } from './../../../../_shared/models/Warehouse/Warehouse';
import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { WarehouseService } from 'src/app/admin/warehouse/services/warehouse.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-warehouse-picker',
  templateUrl: './warehouse-picker.component.html',
  styleUrls: ['./warehouse-picker.component.scss'],
})
export class WarehousePickerComponent implements OnInit {

  @Input() isNew = undefined;
  warehouses: Warehouse[];

  filter: FormControl;
  pickerFormActive = false;
  submitted = false;
  loading = false;
  pickerPaginationConfig = {
    pageIndex: 0,
    pageSize: 5,
    total: undefined
  };


  constructor(
              private warehouseService: WarehouseService,
              private popoverController: PopoverController) { }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.buildFilter();
    this.fetchWarehouses();
  }


  buildFilter(): void {

    this.filter = new FormControl('');

    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(value => {
        this.pickerPaginationConfig.pageIndex = 0;
        this.fetchWarehouses();
      });

    this.fetchWarehouses();
  }

  private fetchWarehouses() {
    this.loading = true;
    this.warehouseService.index(this.filter.value, this.pickerPaginationConfig.pageIndex,this.pickerPaginationConfig.pageSize)
      .subscribe(
        result => {
          this.warehouses = result.items;
          this.pickerPaginationConfig.total = result.total;
        },
        error =>{
          //TODO: add error handler
        },
        () => this.loading = false
      );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  changePage(next: boolean): void {
    this.pickerPaginationConfig.pageIndex = (next ? this.pickerPaginationConfig.pageIndex + 1 : this.pickerPaginationConfig.pageIndex - 1);
    this.fetchWarehouses();
  }


  // eslint-disable-next-line @typescript-eslint/member-ordering
  pick(result: Warehouse) {
     this.popoverController.dismiss(result);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  dismiss(): void {
    this.popoverController.dismiss({
      dismissed: true
    });
  }


}
