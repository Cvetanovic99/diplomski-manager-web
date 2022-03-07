import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loginSuccess } from './auth.actions';
import { AuthService } from '../services/auth.service';
import { State } from '../../_shared/store';

@Injectable()
export class AuthResolver implements Resolve<boolean> {

  constructor(private store: Store<State>,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let error = null;
    this.authService.isLoggedIn()
      .subscribe(response => this.store.dispatch(loginSuccess({user: response})),
                 err => {
                   error = err;
                 });
    return !!error;
  }
}
