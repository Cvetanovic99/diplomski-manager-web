import { Component, OnInit } from '@angular/core';
import { Warehouse } from '../../../../_shared/models/Warehouse/Warehouse';
import { WarehouseService } from '../../services/warehouse.service';
import { ModalController } from '@ionic/angular';
import { WarehouseEditorComponent } from '../../components/warehouse-editor/warehouse-editor.component';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.page.html',
  styleUrls: ['./warehouse-list.page.scss'],
})
export class WarehouseListPage implements OnInit {

  loading = true;
  warehouses: Warehouse[];
  paginationConfig = {
    pageSize: 10,
    pageIndex: 0,
    total: undefined
  };
  editorModal;
  filter: FormControl;

  constructor(private warehouseService: WarehouseService,
              private modalController: ModalController) { }

  ngOnInit(): void {
    this.buildFilter();
  }

  ionViewWillEnter() {
    this.fetchWarehouses();
  }


  ionViewDidLeave() {
    this.loading = false;
    // this.editorModal = undefined;

  }

  fetchWarehouses() {
    this.loading = true;
    this.warehouseService.index(this.filter.value, this.paginationConfig.pageIndex, this.paginationConfig.pageSize).subscribe(
      result => {
        this.warehouses = result.items;
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
    this.fetchWarehouses();
  }

  async openEditor(warehouse?: Warehouse) {
    this.editorModal = await this.modalController.create({
      component: WarehouseEditorComponent,
      componentProps: {
        warehouse
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-shadow
    this.editorModal.onDidDismiss().then((warehouse: any) => {

      if(warehouse.data?.dismissed)
      {
        return;
      }

      if(warehouse.data !== undefined)
      {
        if(this.paginationConfig.pageIndex === 0)
        {

          if(this.warehouses.length<this.paginationConfig.pageSize)
          {
            this.warehouses.unshift(warehouse.data as Warehouse);
          }
          else
          {
            this.warehouses.pop();
            this.warehouses.unshift(warehouse.data as Warehouse);
          }

        }

        this.paginationConfig.total++;
        // if(this.paginationConfig.total<this.paginationConfig.pageSize)
        // {
        //   const checkIfWarehouseExist: Warehouse = this.warehouses.find(x => x.id === warehouse.data.id);
        //   if(checkIfWarehouseExist===undefined)
        //   {
        //     this.warehouses.unshift(warehouse.data as Warehouse);
        //   }
        // }

      }
    });

    return await this.editorModal.present();
  }

  buildFilter() {

    this.filter = new FormControl('');
    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(value => {
        this.paginationConfig.pageIndex = 0;
        this.fetchWarehouses();
      });
  }
}
