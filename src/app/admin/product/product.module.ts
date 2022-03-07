import { NgModule } from '@angular/core';

import { SharedModule } from '../../_shared/shared.module';
import { ProductRoutingModule } from './products-routing.module';

import { ProductEditorComponent } from './components/product-editor/product-editor.component';
import { FindProductComponent } from './components/find-product/find-product.component';

@NgModule({
  declarations: [ProductEditorComponent, FindProductComponent],
  imports: [
    SharedModule,

    ProductRoutingModule
  ]
})
export class ProductModule { }
