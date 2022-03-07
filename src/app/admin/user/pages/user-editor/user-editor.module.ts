import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../_shared/shared.module';

import { UserRegisterPageRoutingModule } from './user-editor-routing.module';

import { UserEditorPage } from './user-editor.page';

@NgModule({
  imports: [
    SharedModule,
    UserRegisterPageRoutingModule
  ],
  declarations: [UserEditorPage]
})
export class UserEditorPageModule {}
