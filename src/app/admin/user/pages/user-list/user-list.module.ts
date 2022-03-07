import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../_shared/shared.module';

import { UserListPageRoutingModule } from './user-list-routing.module';

import { UserListPage } from './user-list.page';


@NgModule({
  imports: [
    SharedModule,

    UserListPageRoutingModule
  ],
  declarations: [UserListPage]
})
export class UserListPageModule {}
