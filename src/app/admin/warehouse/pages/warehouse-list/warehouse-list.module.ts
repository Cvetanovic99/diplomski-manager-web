import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../_shared/shared.module';

import { WarehouseListPageRoutingModule } from './warehouse-list-routing.module';

import { WarehouseListPage } from './warehouse-list.page';

@NgModule({
  imports: [
    SharedModule,
    WarehouseListPageRoutingModule
  ],
  declarations: [WarehouseListPage]
})
export class WarehouseListPageModule {}
