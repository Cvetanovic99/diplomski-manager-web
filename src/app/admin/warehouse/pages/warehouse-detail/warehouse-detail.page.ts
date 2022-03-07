import { SncodesViewerComponent } from './../../components/sncodes-viewer/sncodes-viewer.component';
import { WarehouseEditorComponent } from './../../components/warehouse-editor/warehouse-editor.component';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../_shared/models/Product/Product';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Warehouse } from '../../../../_shared/models/Warehouse/Warehouse';
import { WarehouseService } from '../../services/warehouse.service';
import { ModalController } from '@ionic/angular';
import { AddProductComponent } from '../../components/add-product/add-product.component';

@Component({
  selector: 'app-warehouse-detail',
  templateUrl: './warehouse-detail.page.html',
  styleUrls: ['./warehouse-detail.page.scss'],
})
export class WarehouseDetailPage implements OnInit {

  warehouse: Warehouse;
  products: Product[];
  loading = 0;
  paginationConfig = {
    pageSize: 10,
    pageIndex: 0,
    total: undefined
  };
  filter: FormControl;
  editorModal: any;
  productEditorModal: any;
  snCodesViewerModal: any;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private warehouseService: WarehouseService,
              private modalController: ModalController) {
  }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent(): void {
    this.buildFilter();

    this.route.paramMap.subscribe(params => {
      if (params.has('warehouseId')) {
        const warehouseId = params.get('warehouseId');
        this.fetchProduct(warehouseId);
      } else {
        // add toast nije moguce pronaci magacin
        this.router.navigate(['/admin/magacini']);
      }
    });
  }

  fetchProduct(warehouseId) {
    this.loading++;
    this.warehouseService.show(warehouseId).subscribe(
      result => {

        this.warehouse = result;
        this.fetchProducts();
      },
      error => {
        // TODO (handle-me)
      },
      () => this.loading--
    );
  }

  fetchProducts() {
    this.loading++;
    // eslint-disable-next-line max-len
    this.warehouseService.products(this.warehouse.id, this.filter.value, this.paginationConfig.pageIndex, this.paginationConfig.pageSize).subscribe(
      result => {
        this.products = result.items;
        this.paginationConfig.total = result.total;
      },
      error => {
        // TODO handle me
      },
      () => this.loading--
    );
  }

  changePage(next: boolean) {
    this.paginationConfig.pageIndex = (next ? this.paginationConfig.pageIndex + 1 : this.paginationConfig.pageIndex - 1);
    this.fetchProducts();
  }

  buildFilter() {

    this.filter = new FormControl('');
    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(value => {
        this.paginationConfig.pageIndex = 0;
        this.fetchProducts();
      });
  }

  async openEditor() {
    this.editorModal = await this.modalController.create({
      component: WarehouseEditorComponent,
      componentProps: {
        warehouse : this.warehouse
      }
    });

    this.editorModal.onDidDismiss().then((warehouse: any) => {

      if(warehouse.data?.dismissed)
      {
        return;
      }

      if(warehouse.data !== undefined)
      {
        this.warehouse = warehouse.data;
      }
    });

    return await this.editorModal.present();
  }

  async openProductEditor(product?: Product, isNew?: boolean) {
    this.productEditorModal = await this.modalController.create({
      component: AddProductComponent,
      componentProps: {
        warehouseId: this.warehouse.id,
        product,
        isNew
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-shadow
    this.productEditorModal.onDidDismiss().then((productState: any) => {

      if(productState.data?.dismissed)
      {
        return;
      }

      if(productState?.data)
      {
        if(productState.data.product !== null)
        {


            const checkIfProductInWarehouseExist: Product = this.products.find(x => x.id === productState.data.id);

            if(checkIfProductInWarehouseExist===undefined)
            {
              this.paginationConfig.total++;
              if(this.products.length<this.paginationConfig.pageSize)
              {
                this.products.push(productState.data);
              }
            }
            else
            {
              // eslint-disable-next-line @typescript-eslint/no-shadow
              const index = this.products.findIndex(product => product.id === productState.data.id);
              if(productState.data.hasSN && productState.data.states.length ===0)
              {
                this.products.splice(index,1);
              }
              else
              {
                this.products[index] = productState.data;
              }
            }

        }
      }

    });


    return await this.productEditorModal.present();
  }

  async openSNCodesModal(product: Product)
  {
    this.snCodesViewerModal = await this.modalController.create({
      component: SncodesViewerComponent,
      componentProps: {
        warehouseId: this.warehouse.id,
        productId: product.id
      }
    });

    return await this.snCodesViewerModal.present();
  }

}
