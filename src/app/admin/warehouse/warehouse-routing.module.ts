import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/warehouse-list/warehouse-list.module').then(m => m.WarehouseListPageModule)
  },
  {
    path: ':warehouseId',
    loadChildren: () => import('./pages/warehouse-detail/warehouse-detail.module').then( m => m.WarehouseDetailPageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
