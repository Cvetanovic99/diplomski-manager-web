import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {select, Store} from '@ngrx/store';
import {State} from '../store';
import {isLoggedIn, role} from '../../auth/store/auth.selectors';
import {Roles} from '../constants/Constants';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  private isUserAuth: boolean;
  private isAdmin: boolean;

  constructor(
    private router: Router,
    private store: Store<State>
  ) {
    this.store
      .pipe(select(isLoggedIn))
      .subscribe(loggedIn => this.isUserAuth = loggedIn);

    this.store
      .pipe(select(role))
      .subscribe(data => this.isAdmin = data === Roles.admin);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.isUserAuth && !this.isAdmin) {
      this.router.navigate(['/radnik/projekti']);
    }

    return this.isUserAuth && this.isAdmin;
  }

}
