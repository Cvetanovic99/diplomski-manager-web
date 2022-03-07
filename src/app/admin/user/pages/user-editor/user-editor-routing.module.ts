import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserEditorPage } from './user-editor.page';

const routes: Routes = [
  {
    path: '',
    component: UserEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRegisterPageRoutingModule {}
