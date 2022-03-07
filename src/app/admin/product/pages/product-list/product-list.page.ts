import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ModalController } from '@ionic/angular';

import { Product } from '../../../../_shared/models/Product/Product';
import { ProductService } from '../../services/product.service';

import { ProductEditorComponent } from './../../components/product-editor/product-editor.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit{

  loading = true;
  products: Product[];
  paginationConfig = {
    pageSize: 10,
    pageIndex: 0,
    total: undefined
  };
  editorModal: any;
  filter: FormControl;

  constructor(private productService: ProductService,
              private modalController: ModalController) { }

  ngOnInit(): void {

    this.buildFilter();
  }


  ionViewWillEnter() {

    this.fetchProducts();
  }

  ionViewDidLeave() {

    this.loading = false;
    this.editorModal = undefined;
  }

  fetchProducts() {
    this.loading = true;
    this.productService.index(this.filter.value, this.paginationConfig.pageIndex, this.paginationConfig.pageSize).subscribe(
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
    this.fetchProducts();
  }

  buildFilter() {

    this.filter = new FormControl('');
    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(() => {
        this.paginationConfig.pageIndex = 0;
        this.fetchProducts();
      });
  }

  async openEditor() {
    this.editorModal = await this.modalController.create({
      component: ProductEditorComponent
    });

    this.editorModal.onDidDismiss().then((product: any) => {

      if(product.data?.dismissed)
      {
        return;
      }

      if(product.data !== undefined)
      {

          const checkIfProductExist: Product = this.products.find(x => x.id === product.data.id);
          if(checkIfProductExist === undefined)
          {
            if(this.products.length<this.paginationConfig.pageSize)
            {
              this.products.push(product.data as Product);
            }
            this.paginationConfig.total++;
          }
      }
    });

    return await this.editorModal.present();
  }

}
