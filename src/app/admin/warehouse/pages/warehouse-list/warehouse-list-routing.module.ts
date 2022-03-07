import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarehouseListPage } from './warehouse-list.page';

const routes: Routes = [
  {
    path: '',
    component: WarehouseListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseListPageRoutingModule {}
