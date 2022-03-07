import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import { logout } from './auth/store/auth.actions';
import {State} from './_shared/store';
import {isLoggedIn, role} from './auth/store/auth.selectors';
import {Roles} from './_shared/constants/Constants';
import {SideMenuService} from "./_shared/services/side-menu.service";
import {SideMenuItem} from "./_shared/models/SideMenuItem";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  showMenu = false;
  appPages: SideMenuItem[] = [];

  constructor(private router: Router,
              private store: Store<State>,
              private sideMenuService: SideMenuService) {}

  ngOnInit() {
    this.getSideMenuItems();
    this.showSideMenu();
  }

  showSideMenu() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMenu = !(this.router.url === '/prijava');
      }
    });
  }

  logout() {
    this.store.dispatch(logout());
  }

  getSideMenuItems() {
    this.sideMenuService.getSideMenuItems().subscribe(result => {
      this.appPages = result;
    });
  }
}
