import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User } from '../../../../_shared/models/Auth/User';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {


  loading = true;
  users: User[];
  paginationConfig = {
    pageSize: 10,
    pageIndex: 0,
    total: undefined
  };
  filter: FormControl;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {

    this.buildFilter();
  }

  ionViewWillEnter() {

    this.fetchUsers();
  }

  ionViewDidLeave() {

    this.loading = false;
  }

  fetchUsers() {
    this.loading = true;
    this.userService.index(this.filter.value, this.paginationConfig.pageIndex, this.paginationConfig.pageSize).subscribe(
      result => {
        this.users = result.items;
        this.paginationConfig.total = result.total;
      },
      error => {
        // TODO (handle-me)
      },
      () => this.loading = false
    );
  }

  changePage(next: boolean) {
    this.paginationConfig.pageIndex = (next ? this.paginationConfig.pageIndex + 1 : this.paginationConfig.pageIndex - 1);
    this.fetchUsers();
  }

  buildFilter() {

    this.filter = new FormControl('');
    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(() => {
        this.fetchUsers();
      });
  }

  goToRegister() {
    this.router.navigate(['/admin/zaposljeni/dodaj']);
  }

  openEditor(event, userId)
  {
    event.stopPropagation();

    this.router.navigate([`/admin/zaposljeni/${userId}/izmeni`]);
  }
}
