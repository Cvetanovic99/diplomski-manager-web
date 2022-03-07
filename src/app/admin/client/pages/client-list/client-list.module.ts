import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../_shared/shared.module';

import { ClientListPageRoutingModule } from './client-list-routing.module';

import { ClientListPage } from './client-list.page';

@NgModule({
  imports: [
    SharedModule,
    ClientListPageRoutingModule
  ],
  declarations: [ClientListPage]
})
export class ClientListPageModule {}
