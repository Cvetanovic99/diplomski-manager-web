import { SharedModule } from './../../../../_shared/shared.module';
import { NgModule } from '@angular/core';

import { ProjectListPageRoutingModule } from './project-list-routing.module';

import { ProjectListPage } from './project-list.page';

@NgModule({
  imports: [
    SharedModule,
    ProjectListPageRoutingModule
  ],
  declarations: [ProjectListPage]
})
export class ProjectListPageModule {}
