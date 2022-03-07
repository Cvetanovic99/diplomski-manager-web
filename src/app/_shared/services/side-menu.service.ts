import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SideMenuItem } from '../models/SideMenuItem';
import { Store } from '@ngrx/store';
import { State } from '../store';
import { Roles } from '../constants/Constants';
import { JwtTokenService } from './jwt-token.service';


@Injectable({
  providedIn: 'root'
})
export class SideMenuService {

  public sideMenuItems = new BehaviorSubject<SideMenuItem[]>([]);

  constructor(private store: Store<State>,
              private jwtTokenService: JwtTokenService) {

  }

  getAdminSideMenuItems(): SideMenuItem[] {
    return [
      { title: 'Projekti', url: '/admin/projekti', icon: 'briefcase' } as SideMenuItem,
      { title: 'Magacini', url: '/admin/magacini', icon: 'business' } as SideMenuItem,
      { title: 'Proizvodi', url: '/admin/proizvodi', icon: 'pricetags' } as SideMenuItem,
      { title: 'Zaposleni', url: '/admin/zaposljeni', icon: 'people' } as SideMenuItem,
      { title: 'Klijenti', url: '/admin/klijenti', icon: 'people' } as SideMenuItem
    ];
  }

  getWorkerSideMenuItems(): SideMenuItem[] {
    return [
      { title: 'Projekti', url: 'radnik/projekti', icon: 'briefcase' } as SideMenuItem,
      { title: 'Zaduženi alat', url: 'radnik/zaduzeni-alat', icon: 'hammer' } as SideMenuItem
    ];
  }

  getSideMenuItems(): BehaviorSubject<SideMenuItem[]> {
    return this.sideMenuItems;
  }

  setSideMenuItems() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const role = this.jwtTokenService.getRoleFromToken(accessToken);
      if (role === Roles.admin) {
        this.sideMenuItems.next(this.getAdminSideMenuItems());
      }
      else {
        this.sideMenuItems.next(this.getWorkerSideMenuItems());
      }
    }
  }
}
