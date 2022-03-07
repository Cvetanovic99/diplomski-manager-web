import { NgModule } from '@angular/core';

import { UserDetailPageRoutingModule } from './user-detail-routing.module';

import { UserDetailPage } from './user-detail.page';
import { SharedModule } from '../../../../_shared/shared.module';

@NgModule({
  imports: [
    SharedModule,

    UserDetailPageRoutingModule
  ],
  declarations: [UserDetailPage]
})
export class UserDetailPageModule {}
