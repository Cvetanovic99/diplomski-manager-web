import { NgModule } from '@angular/core';

import { SharedModule } from '../../_shared/shared.module';
import { ClientEditorComponent } from './components/client-editor/client-editor.component';
import { ClientRoutingModule } from './client-routing.module';



@NgModule({
  declarations: [ ClientEditorComponent ],
  imports: [
    SharedModule,

    ClientRoutingModule
  ]
})
export class ClientModule { }
