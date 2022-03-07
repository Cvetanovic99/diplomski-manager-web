import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { select, Store } from '@ngrx/store';

import { State } from '../store';
import { isLoggedIn } from '../../auth/store/auth.selectors';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isUserAuth: boolean;

  constructor(
    private router: Router,
    private store: Store<State>
  ) {
    this.store
      .pipe(select(isLoggedIn))
      .subscribe(loggedIn => this.isUserAuth = loggedIn);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.isUserAuth) {
      this.router.navigate(['/prijava']);
    }

    return this.isUserAuth;
  }
}
