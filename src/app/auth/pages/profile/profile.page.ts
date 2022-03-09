import { Component } from '@angular/core';
import { select, Store} from '@ngrx/store';
import { State } from '../../../_shared/store';
import { authUser } from '../../store/auth.selectors';
import { User } from '../../../_shared/models/Auth/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../../admin/user/services/user.service';
import { UpdateUserDto } from '../../../_shared/models/Auth/UpdateUserDto';
import { ToastService } from '../../../_shared/services/toast.service';
import { UpdatePasswordDto } from '../../../_shared/models/Auth/UpdatePasswordDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  user: User;

  dataEditorForm: FormGroup;
  dataEditorFormActive = false;
  dataEditorFormSubmitted = false;

  passwordEditorForm: FormGroup;
  passwordEditorFormActive = false;
  passwordEditorFormSubmitted = false;

  constructor(private router: Router,
              private store: Store<State>,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private toastService: ToastService) { }

  ionViewWillEnter() {

    this.initialize();
  }

  initialize() {
    this.getUser();
  }

  getUser() {
    this.store
      .pipe(select(authUser))
      .subscribe(user => {
        if (!user) {
          this.router.navigate(['/prijava']);
        }
        this.user = user;
        this.buildDataForm();
        this.buildPasswordForm();
      });
  }

  buildDataForm() {
    this.dataEditorFormSubmitted = false;
    this.dataEditorForm = this.formBuilder.group({
      id: [this.user ? this.user.id : '', Validators.required],
      name: [this.user ?this.user.name: '', Validators.required],
      surname: [this.user ? this.user.surname : '', Validators.required],
      email: [this.user ? this.user.email : '', Validators.required],
      tools: [this.user ? this.user.tools : '']
    });

    this.dataEditorFormActive = true;
  }

  buildPasswordForm() {
    this.passwordEditorFormSubmitted = false;
    this.passwordEditorForm = this.formBuilder.group({
      currentPassword: ['', [ Validators.required, Validators.minLength(6) ] ],
      password: ['', [ Validators.required, Validators.minLength(6) ] ],
      confirmedPassword: ['', [ Validators.required] ]
    }, {
      validators: [
        this.authService.strongPassword,
        this.authService.passwordsMatch
      ]
    });

    this.passwordEditorFormActive = true;
  }

  onDataSubmit() {
    if (this.dataEditorForm.invalid) {
      this.dataEditorFormSubmitted = true;
      return;
    }

    this.userService.update(this.dataEditorForm.value as UpdateUserDto).subscribe(
        result => {
          const newUser: UpdateUserDto = this.dataEditorForm.value as UpdateUserDto;
          this.user = newUser as unknown as User;

          this.toastService.showSuccess('Podaci su uspešno ažurirani!');
        },
        error => {
          // TODO handle error
          this.toastService.showError('Podaci trenutno ne mogu biti ažurirani. Pokušajte kasnije');
        }
      );
  }

  onPasswordSubmit() {
    if (this.passwordEditorForm.invalid) {
      this.passwordEditorFormSubmitted = true;
      return;
    }

    this.authService.changePassword(this.passwordEditorForm.value as UpdatePasswordDto).subscribe(
      result => {
        this.toastService.showSuccess('Lozinka je uspešno ažurirani!');
        this.passwordEditorForm.reset();
      },
      error => {
        // TODO handle error
        this.toastService.showError('Pogrešna trenutna lozinka!');
      }
    );
  }

  showPassword(password): void {
    password.type = password.type === 'password' ? 'text' : 'password';
  }

}
