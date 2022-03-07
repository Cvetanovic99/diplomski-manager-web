import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ToolsDetailPage } from './tools-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ToolsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolsDetailPageRoutingModule {}
