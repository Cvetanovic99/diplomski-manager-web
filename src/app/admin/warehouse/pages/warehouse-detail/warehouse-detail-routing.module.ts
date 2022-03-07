import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarehouseDetailPage } from './warehouse-detail.page';

const routes: Routes = [
  {
    path: '',
    component: WarehouseDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseDetailPageRoutingModule {}
