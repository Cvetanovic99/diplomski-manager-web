import { WarehousePickerComponent } from './components/warehouse-picker/warehouse-picker.component';
import { ClientPickerComponent } from './components/client-picker/client-picker.component';
import { NgModule } from '@angular/core';

import { ProjectRoutingModule } from './project-routing.module';

import { SharedModule } from 'src/app/_shared/shared.module';

import { ProjectEditorComponent } from './components/project-editor/project-editor.component';
import { PickerComponent } from './components/picker/picker.component';

@NgModule({
  declarations: [ProjectEditorComponent, PickerComponent, ClientPickerComponent, WarehousePickerComponent],
  imports: [
    SharedModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }
