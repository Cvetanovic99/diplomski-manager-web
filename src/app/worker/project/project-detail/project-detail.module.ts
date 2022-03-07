import { NgModule } from '@angular/core';

import { ProjectDetailPageRoutingModule } from './project-detail-routing.module';

import { ProjectDetailPage } from './project-detail.page';
import { SharedModule } from '../../../_shared/shared.module';

@NgModule({
  imports: [
    SharedModule,

    ProjectDetailPageRoutingModule
  ],
  declarations: [ProjectDetailPage]
})
export class ProjectDetailPageModule {}
