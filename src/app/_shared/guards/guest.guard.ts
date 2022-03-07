import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import { isLoggedIn } from '../../auth/store/auth.selectors';
import { select, Store } from '@ngrx/store';
import { State } from '../store';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
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

    return !this.isUserAuth;
  }
}
