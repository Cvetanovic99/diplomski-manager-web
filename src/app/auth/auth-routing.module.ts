import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GuestGuard } from '../_shared/guards/guest.guard';
import { AuthGuard } from '../_shared/guards/auth.guard';


const routes: Routes = [
  {
    path: 'prijava',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [ GuestGuard ]
  },
  {
    path: 'profil',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [ AuthGuard ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
