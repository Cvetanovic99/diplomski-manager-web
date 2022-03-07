import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/user-list/user-list.module').then( m => m.UserListPageModule)
  },
  {
    path: 'dodaj',
    loadChildren: () => import('./pages/user-create/user-create.module').then( m => m.UserCreatePageModule)
  },
  {
    path: ':userId/izmeni',
    loadChildren: () => import('./pages/user-editor/user-editor.module').then( m => m.UserEditorPageModule)
  },
  {
    path: ':userId',
    loadChildren: () => import('./pages/user-detail/user-detail.module').then( m => m.UserDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
