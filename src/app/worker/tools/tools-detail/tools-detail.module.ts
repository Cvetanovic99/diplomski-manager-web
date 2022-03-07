import { SharedModule } from './../../../_shared/shared.module';
import { NgModule } from '@angular/core';

import { ToolsDetailPageRoutingModule } from './tools-detail-routing.module';

import { ToolsDetailPage } from './tools-detail.page';

@NgModule({
  imports: [
    SharedModule,

    ToolsDetailPageRoutingModule
  ],
  declarations: [ToolsDetailPage]
})
export class ToolsDetailPageModule {}
