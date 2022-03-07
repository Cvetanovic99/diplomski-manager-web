import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import { State } from '../../../_shared/store';
import { login } from '../../store/auth.actions';
import { userAuthCheck } from '../../store/auth.selectors';

@Component({
             selector:    'app-login',
             templateUrl: './login.page.html',
             styleUrls:   ['./login.page.scss'],
           })
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  formActive = false;
  submitted = false;
  isAuthenticatingIndicator = false;

  constructor(private formBuilder: FormBuilder,
              private store: Store<State>) {
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getIsAuthenticatingIndicator();
    this.buildLoginForm();
  }

  buildLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [ Validators.required, Validators.email ] ],
      password: ['', [ Validators.required,  Validators.minLength(6) ] ]
    });
    this.formActive = true;
  }

  login(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(login({
      user: {
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value
      }
    }));
  }

  ionViewDidLeave() {
    this.submitted = false;
    this.loginForm.reset();
  }

  getIsAuthenticatingIndicator() {
    this.store
      .pipe(select(userAuthCheck))
      .subscribe(data => {
        this.isAuthenticatingIndicator = data;
      });
  }

  showPassword(password): void {
    password.type = password.type === 'password' ? 'text' : 'password';
  }
}
