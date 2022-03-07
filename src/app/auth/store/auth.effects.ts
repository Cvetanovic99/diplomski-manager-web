import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AuthActions from './auth.actions';
import { JwtTokenService } from '../../_shared/services/jwt-token.service';
import { AuthService } from '../services/auth.service';
import { SideMenuService } from '../../_shared/services/side-menu.service';
import { State } from '../../_shared/store';
import { setCurrentUserRole } from './auth.actions';
import { ToastService } from '../../_shared/services/toast.service';

@Injectable()
export class AuthEffects implements OnInitEffects {

  init$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.authInit),
      mergeMap(() => {
        return this.authService.isLoggedIn()
          .pipe(
            map(response => {
              this.sideMenuService.setSideMenuItems();
              const accessToken = localStorage.getItem('accessToken');
              if (accessToken) {
                const role = this.jwtTokenService.getRoleFromToken(accessToken);
                this.store.dispatch(setCurrentUserRole({ role }));
              }
              this.router.navigate(['/admin/projekti']);
              return AuthActions.loginSuccess({user: response});
            }),
            catchError((err) => {
              this.router.navigate(['/prijava']);
              return of(AuthActions.loginFailure({error: err.error}));
            })
          );
      })
    )
  );

  login$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.login),
      mergeMap((action) => this.authService.login({
          email:    action.user.email,
          password: action.user.password
        })
          .pipe(
            map(response => {
              const role = this.jwtTokenService.getRoleFromToken(response.accessToken);
              localStorage.setItem('role', role);
              localStorage.setItem('accessToken', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken);
              localStorage.setItem('expiration', this.jwtTokenService.getExpirationFromToken(response.accessToken));
              return AuthActions.getCurrentUser({ role });
            }),
            catchError((err) => {
              this.toastService.showError(err.error.message);
              // this.showErrorToast('Login unsuccessful');
              return of(AuthActions.loginFailure({error: err.error}));
            })
          )
      )
    )
  );

  getCurrentUser$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.getCurrentUser),
      mergeMap(() => this.authService.isLoggedIn()
        .pipe(
          map(response => {
            this.sideMenuService.setSideMenuItems();
            this.router.navigate(['/admin/projekti']);
            return AuthActions.loginSuccess({user: response});
          }),
          catchError((err) => {
            // this.showErrorToast(err.error);
            return of(AuthActions.loginFailure({error: err.error}));
          })
        )
      )
    )
  );

  // register$ = createEffect(() => this.actions$
  //   .pipe(
  //     ofType(AuthActions.register),
  //     mergeMap((action) => this.authService.register(action.user)
  //       .pipe(
  //         map(response => {
  //           localStorage.setItem('role', this.jwtTokenService.getRoleFromToken(response.accessToken));
  //           localStorage.setItem('accessToken', response.accessToken);
  //           localStorage.setItem('refreshToken', response.refreshToken);
  //           localStorage.setItem('expiration', this.jwtTokenService.getExpirationFromToken(response.accessToken));
  //           return AuthActions.getCurrentUser();
  //         }),
  //         catchError((err) => {
  //           this.showErrorToast(err.error);
  //           return of(AuthActions.registerFailure({error: err.error}));
  //         })
  //       )
  //     )
  //   )
  // );

  logout$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.logout),
      mergeMap((action) => this.authService.logout()
        .pipe(
          map(response => {
            localStorage.clear();
            this.router.navigate(['/prijava']);
            return AuthActions.logoutSuccess();
          }),
          catchError((err) => {
            this.router.navigate(['/admin/projekti']);
            return of(AuthActions.logoutSuccess());
          })
        )
      )
    )
  );

  constructor(private actions$: Actions,
              private authService: AuthService,
              private router: Router,
              private toastController: ToastController,
              private jwtTokenService: JwtTokenService,
              private sideMenuService: SideMenuService,
              private store: Store<State>,
              private toastService: ToastService) {
  }

  ngrxOnInitEffects(): Action {
    return AuthActions.authInit();
  }

  async showErrorToast(err) {

    const toast = await this.toastController.create({
      message:       err.message,
      duration:      2000,
      position:      'top',
      color:         'danger',
      keyboardClose: true,
      animated:      true
    });
    toast.present();
  }
}


