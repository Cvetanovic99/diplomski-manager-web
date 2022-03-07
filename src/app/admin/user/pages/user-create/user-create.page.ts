import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../_shared/models/Auth/User';
import { AuthService } from '../../../../auth/services/auth.service';
import { ToastService } from '../../../../_shared/services/toast.service';
import { Router } from '@angular/router';
import { Register } from '../../../../_shared/models/Auth/Register';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.page.html',
  styleUrls: ['./user-create.page.scss'],
})
export class UserCreatePage implements OnInit {


  editorForm: FormGroup;
  editorFormActive = false;
  submitted = false;
  user: User;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private toastService: ToastService,
              private router: Router) { }


  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.buildEditorForm();
  }

  buildEditorForm(): void {
    this.editorForm = this.formBuilder.group({
      name:              ['', Validators.required],
      surname:           ['', Validators.required],
      email:             ['', [Validators.required, Validators.email] ],
      tools:             [''],
      password:          ['', [Validators.required, Validators.minLength(6)]],
      confirmedPassword: ['', Validators.required],
    }, {
      validators: [
        this.authService.strongPassword,
        this.authService.passwordsMatch
      ]
    });

    this.editorFormActive = true;
  }

  onSubmit(): void {

    this.submitted = true;
    if (this.editorForm.invalid) {
      return;
    }

    this.authService.register(this.editorForm.value as Register).subscribe(
      result => {
        this.toastService.showSuccess('Novi radnik je uspešno dodat u sistem!');
        this.router.navigate(['/admin/zaposljeni']);
      },
      error => {
        this.toastService.showSuccess(error.error.message);
      }
    );

  }

  ionViewDidLeave() {
    this.editorForm.reset();
  }

  showPassword(password): void {
    password.type = password.type === 'password' ? 'text' : 'password';
  }

}
