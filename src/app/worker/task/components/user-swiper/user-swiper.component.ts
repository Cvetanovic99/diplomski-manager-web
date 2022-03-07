import { UserService } from './../../../../admin/user/services/user.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User } from 'src/app/_shared/models/Auth/User';

@Component({
  selector: 'app-user-swiper',
  templateUrl: './user-swiper.component.html',
  styleUrls: ['./user-swiper.component.scss'],
})
export class UserSwiperComponent implements OnInit {

  @Input() mainWorkerId: number;
  @Input() isUpdate: boolean;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Input() isCoworkerPicked: boolean = false;
  @Output() coworkerEmmiter = new EventEmitter<User>();
  @Output() doesntHaveCoworkerEmmiter = new EventEmitter();
  @Output() dismissEmmiter = new EventEmitter();
  @Output() slideToPreviousEmmiter = new EventEmitter();
  @Output() doneWithChangesEmmiter = new EventEmitter();


  users:   User[];

  filter: FormControl;
  pickerFormActive = false;
  submitted = false;
  loading = false;

  pickerPaginationConfig = {
    pageIndex: 0,
    pageSize: 5,
    total: undefined
  };

  constructor(public userService: UserService,
              private changeDetectionReference: ChangeDetectorRef) { }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.buildFilter();
  }

  buildFilter(): void {

    this.filter = new FormControl('');

    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(value => {
        this.pickerPaginationConfig.pageIndex = 0;
        this.fetchUsers();
      });

    this.fetchUsers();
  }

  changePage(next: boolean): void {
    this.pickerPaginationConfig.pageIndex = (next ? this.pickerPaginationConfig.pageIndex + 1 : this.pickerPaginationConfig.pageIndex - 1);
    this.fetchUsers();
  }

  addUser(user: User): void {
    this.coworkerEmmiter.emit(user);
    this.pickerPaginationConfig.pageIndex = 0;
    this.fetchUsers();
  }

  doesntHaveCoworker(): void{
    this.doesntHaveCoworkerEmmiter.emit();
  }

  private fetchUsers(): void {
    this.loading = true;

    this.userService.colleagues(this.mainWorkerId, this.filter.value,
                                      this.pickerPaginationConfig.pageIndex,
                                      this.pickerPaginationConfig.pageSize)
      .subscribe(
        result => {
          this.users = result.items;
          this.pickerPaginationConfig.total = result.total;

          this.loading = false;
          this.changeDetectionReference.detectChanges();
        },
        error =>{
          //TODO: add error handler
        },
        () => this.loading = false
      );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  dismiss(): void {
    this.dismissEmmiter.emit();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  prev(): void {
    this.slideToPreviousEmmiter.emit();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  doneWithChanges(): void {
    this.doneWithChangesEmmiter.emit();
    this.pickerPaginationConfig.pageIndex = 0;
    this.fetchUsers();
  }

}
