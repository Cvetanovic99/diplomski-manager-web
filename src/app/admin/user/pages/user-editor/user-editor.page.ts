import { User } from '../../../../_shared/models/Auth/User';
import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { ToastService } from '../../../../_shared/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateUserDto } from '../../../../_shared/models/Auth/UpdateUserDto';
import { SetPasswordDto } from '../../../../_shared/models/Auth/SetPasswordDto';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.page.html',
  styleUrls: ['./user-editor.page.scss'],
})
export class UserEditorPage implements OnInit {

  user: User;
  dataEditorForm: FormGroup;
  dataEditorFormActive = false;
  dataEditorFormSubmitted = false;
  passwordEditorForm: FormGroup;
  passwordEditorFormActive = false;
  passwordEditorFormSubmitted = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private toastService: ToastService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) { }


  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.checkUrlParam();
  }

  checkUrlParam() {
    this.route.paramMap.subscribe(params => {
      if (params.has('userId')) {
        this.fetchUser(+params.get('userId'));
      } else {
        this.router.navigate(['/admin/zaposljeni']);
      }
    });
  }

  fetchUser(userId: number) {
    this.userService.show(userId).subscribe(
      result => {
        this.user = result;
        this.buildForms();
      });
  }

  /**
   * Build forms -------------------------------------------------------------------------------------------------------
   */

  buildForms() {
    this.buildDataForm();
    this.buildPasswordForm();
  }

  buildDataForm(): void {
    this.dataEditorForm = this.formBuilder.group({
      id: [this.user ? this.user.id : '', Validators.required],
      name: [this.user ?this.user.name: '', Validators.required],
      surname: [this.user ? this.user.surname : '', Validators.required],
      email: [this.user ? this.user.email : '', Validators.required],
      tools: [this.user ? this.user.tools : ''],
    });

    this.dataEditorFormActive = true;
  }

  buildPasswordForm(): void {
    this.passwordEditorForm = this.formBuilder.group({
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

  /**
   * On Submit ---------------------------------------------------------------------------------------------------------
   */

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

    this.userService.setPassword(this.user.id, this.passwordEditorForm.value as SetPasswordDto).subscribe(
      result => {
        this.toastService.showSuccess('Lozinka je uspešno ažurirana!');
        this.passwordEditorForm.reset();
      },
      error => {
        // TODO handle error
        this.toastService.showError('Pogrešna trenutna lozinka!');
      }
    );
  }

  ionViewDidLeave() {
    this.resetForms();
  }

  resetForms(): void {
    this.dataEditorFormSubmitted = false;
    this.dataEditorForm.reset();
    this.passwordEditorFormSubmitted = false;
    this.passwordEditorForm.reset();
  }

  showPassword(password): void {
    password.type = password.type === 'password' ? 'text' : 'password';
  }

}
