import { NgModule } from '@angular/core';
import { UserCreatePageRoutingModule } from './user-create-routing.module';

import { UserCreatePage } from './user-create.page';
import { SharedModule } from '../../../../_shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    UserCreatePageRoutingModule
  ],
  declarations: [UserCreatePage]
})
export class UserCreatePageModule {}
