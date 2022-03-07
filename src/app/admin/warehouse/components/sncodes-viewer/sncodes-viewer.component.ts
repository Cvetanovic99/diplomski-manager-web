import { ProductStateDto } from './../../../../_shared/models/Product/ProductStateDto';
import { WarehouseService } from 'src/app/admin/warehouse/services/warehouse.service';
import { Product } from './../../../../_shared/models/Product/Product';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-sncodes-viewer',
  templateUrl: './sncodes-viewer.component.html',
  styleUrls: ['./sncodes-viewer.component.scss'],
})
export class SncodesViewerComponent {

  @Input() productId:   number;
  @Input() warehouseId: number;

  loading = true;

  paginationConfig = {
    pageSize: 10,
    pageIndex: 0,
    total: undefined
  };
  editorModal;
  filter: FormControl;
  products:     ProductStateDto[];

  constructor(private modalController: ModalController,
              private warehouseService: WarehouseService
             ) { }

  ionViewWillEnter() {
    this.buildFilter();
    this.fetchSNCodes();
  }

  ionViewDidLeave() {
    this.loading = false;
    this.products = undefined;
    this.paginationConfig = {
      pageIndex: 0,
      pageSize: 10,
      total: undefined
    };
    this.editorModal = undefined;
    this.filter = undefined;
  }

  fetchSNCodes() {
    this.loading = true;
    this.warehouseService.snCodesIndex
      (this.productId,this.warehouseId,this.filter.value, this.paginationConfig.pageIndex, this.paginationConfig.pageSize).subscribe(
      result => {
        this.products = result.items;
        this.paginationConfig.total = result.total;
      },
      error => {
        // TODO (handle-me)
      },
      () => this.loading = false
    );
  }

  changePage(next: boolean) {
    this.paginationConfig.pageIndex = (next ? this.paginationConfig.pageIndex + 1 : this.paginationConfig.pageIndex - 1);
    this.fetchSNCodes();
  }

  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true
    });
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
  }

}
