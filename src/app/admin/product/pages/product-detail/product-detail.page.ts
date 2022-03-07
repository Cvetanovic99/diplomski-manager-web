import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../_shared/models/Product/Product';
import {FormBuilder, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import {WarehouseProduct} from '../../../../_shared/models/Warehouse/WarehouseProduct';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { ProductEditorComponent } from '../../components/product-editor/product-editor.component';
import {FindProductComponent} from '../../components/find-product/find-product.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  product: Product;
  warehouses: WarehouseProduct[];
  loading = 0;
  paginationConfig = {
    pageSize: 10,
    pageIndex: 0,
    total: undefined,
    productQuantityTotal: undefined
  };
  filter: FormControl;


  editorModal: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private productService: ProductService,
              private modalController: ModalController) {
  }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent(): void {
    this.buildFilter();

    this.route.paramMap.subscribe(params => {
      if (params.has('productId')) {
        const productId = params.get('productId');
        this.fetchProduct(productId);
      } else {
        this.router.navigate(['/admin/proizvodi']);
      }
    });
  }

  fetchProduct(productId) {
    this.loading++;
    this.productService.show(productId).subscribe(
      result => {
        this.product = result;
        this.fetchWarehouses();
      },
      error => {
        // TODO (handle-me)
      },
      () => this.loading--
    );
  }

  fetchWarehouses() {
    this.loading++;
    this.productService.warehouses(this.product.id, this.filter.value,
                  this.paginationConfig.pageIndex, this.paginationConfig.pageSize).subscribe(
      result => {
        this.warehouses = result.items;
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
    this.fetchWarehouses();
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

  async openEditor() {
    this.editorModal = await this.modalController.create({
      component: ProductEditorComponent,
      componentProps: {
        product : this.product
      }
    });

    this.editorModal.onDidDismiss().then((product: any) => {

      if(product.data?.dismissed)
      {
        return;
      }

      if(product.data !== undefined)
      {
        this.product = product.data;
      }
    });

    return await this.editorModal.present();
  }


  openFindModal() {
    this.modalController.create({
      component: FindProductComponent,
      componentProps: {
        product : this.product
      }
    }).then(modal => modal.present());
  }
}
