import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: 'magacini',
    loadChildren: () => import('./warehouse/warehouse.module').then(m => m.WarehouseModule)
  },
  {
    path: 'proizvodi',
    loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'zaposljeni',
    loadChildren: () => import('./user/user.module').then( m => m.UserModule)
  },
  {
    path: 'klijenti',
    loadChildren: () => import('./client/client.module').then( m => m.ClientModule),
  },
  {
    path: 'projekti',
    loadChildren: () => import('./project/project.module').then( m => m.ProjectModule)
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
