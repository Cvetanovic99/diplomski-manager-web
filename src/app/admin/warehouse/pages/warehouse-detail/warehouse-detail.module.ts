import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WarehouseDetailPageRoutingModule } from './warehouse-detail-routing.module';

import { WarehouseDetailPage } from './warehouse-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    IonicModule,
    WarehouseDetailPageRoutingModule
  ],
  declarations: [WarehouseDetailPage]
})
export class WarehouseDetailPageModule {}
