import { SncodesViewerComponent } from './components/sncodes-viewer/sncodes-viewer.component';
import { ProductPickerComponent } from './components/product-picker/product-picker.component';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../_shared/shared.module';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseEditorComponent } from './components/warehouse-editor/warehouse-editor.component';
import { AddProductComponent } from './components/add-product/add-product.component';


@NgModule({
  declarations: [ WarehouseEditorComponent, AddProductComponent, ProductPickerComponent, SncodesViewerComponent ],
  imports: [
    SharedModule,

    WarehouseRoutingModule
  ]
})
export class WarehouseModule { }
