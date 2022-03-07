import { ToolsEditorComponent } from './components/tools-editor/tools-editor.component';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../_shared/shared.module';
import { UserRoutingModule } from './user-routing.module';


@NgModule({
  declarations: [ToolsEditorComponent ],
  imports: [
    SharedModule,

    UserRoutingModule
  ]
})
export class UserModule { }
