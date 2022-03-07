import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/shared.module';
import { WorkerRoutingModule } from './worker-routing.module';



@NgModule({
  declarations: [],
  imports: [
    SharedModule,

    WorkerRoutingModule
  ]
})
export class WorkerModule { }
