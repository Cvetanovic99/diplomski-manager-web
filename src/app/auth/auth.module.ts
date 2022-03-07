import { NgModule } from '@angular/core';
import { SharedModule } from '../_shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { authFeatureKey, authReducer } from './store/auth.reducer';
import { AuthEffects } from './store/auth.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthResolver } from './store/auth.resolver';



@NgModule({
  declarations: [ ],
  imports: [
    SharedModule,
    AuthRoutingModule,

    StoreModule.forFeature(authFeatureKey, authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  exports: [
    // AuthResolver
  ]
})
export class AuthModule { }
