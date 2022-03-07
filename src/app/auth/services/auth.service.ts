import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { BaseApiService } from '../../_shared/services/base-api.service';

import { Login } from '../../_shared/models/Auth/Login';
import { Token } from '../../_shared/models/Auth/Token';
import {Register} from "../../_shared/models/Auth/Register";
import {FormGroup, ValidationErrors} from "@angular/forms";
import {UpdatePasswordDto} from "../../_shared/models/Auth/UpdatePasswordDto";
// import { Register } from '../../_shared/models/Register';


@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {

  login(login: Login): Observable<Token> {

    return this.http.post<Token>(`${this.apiUrl}/api/accounts/login`, login);
  }

  register(register: Register): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/api/accounts/register`, register);
  }

  logout(): Observable<any> {

    return this.http.post(`${this.apiUrl}/api/accounts/logout`, {});
  }

  isLoggedIn(): Observable<any> {

    return this.http.get(`${this.apiUrl}/api/accounts/current-user`);
  }

  revokeToken(token: Token, accessToken: string): Observable<Token> {

    return this.http.post<Token>(`${this.apiUrl}/api/accounts/revoke-token`, token,
      {headers: new HttpHeaders({'Expired-token': `Bearer ${accessToken}`})});
  }

  changePassword(updatePassword: UpdatePasswordDto): Observable<any> {

    return this.http.post<Token>(`${this.apiUrl}/api/accounts/change-password`, updatePassword);
  }

  strongPassword(registerForm: FormGroup): ValidationErrors | null {

    const password           = registerForm.controls.password.value;
    const hasNonAlphanumeric = /\W/;
    const hasNumber          = /\d/;
    const hasUppercase       = /[A-Z]/;

    return (hasNonAlphanumeric.test(password) && hasNumber.test(password) && hasUppercase.test(password) ? null :
      {passwordNotStrong: true});
  }

  passwordsMatch(registerForm: FormGroup): ValidationErrors | null {

    const password     = registerForm.controls.password.value;
    const confirmation = registerForm.controls.confirmedPassword.value;

    return (password === confirmation ? null : {passwordsNotMatched: true});
  }
}

