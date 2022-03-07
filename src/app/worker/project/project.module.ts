import { NgModule } from '@angular/core';

import { SharedModule } from '../../_shared/shared.module';
import { ProjectRoutingModule } from './project-routing.module';
import { TaskModule } from '../task/task.module';



@NgModule({
  declarations: [],
  imports: [
    SharedModule,

    TaskModule,

    ProjectRoutingModule
  ]
})
export class ProjectModule { }
