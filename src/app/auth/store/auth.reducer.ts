import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { Token } from '../../_shared/models/Auth/Token';
import { User } from '../../_shared/models/Auth/User';

export const authFeatureKey = 'auth';

export interface AuthState {
  token: Token;
  role: string;
  user: User;
  userAuthCheck: boolean;
}

export const initialAuthState: AuthState = {
  token:         undefined,
  user:          undefined,
  role:          undefined,
  userAuthCheck: false
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.authInit, (state, action) => {
    return {
      ...state,
      userAuthCheck: true
    };
  }),

  on(AuthActions.getCurrentUser, (state, action) => {
    return {
      ...state,
      role:          action.role,
      userAuthCheck: false
    };
  }),

  on(AuthActions.login, (state, action) => {
    return {
      ...state,
      userAuthCheck: true
    };
  }),

  on(AuthActions.loginSuccess, (state, action) => {
    return {
      ...state,
      user:          action.user,
      userAuthCheck: false
    };
  }),

  on(AuthActions.loginFailure, (state, action) => {
    return {
      ...state,
      user:          undefined,
      role:          undefined,
      userAuthCheck: false,
    };
  }),

  on(AuthActions.setCurrentUserRole, (state, action) => {
    return {
      ...state,
      role:          action.role,
      userAuthCheck: false
    };
  }),

  // on(AuthActions.register, (state, action) => {
  //   return {
  //     ...state,
  //     userAuthCheck: false
  //   };
  // }),
  //
  // on(AuthActions.registerSuccess, (state, action) => {
  //   return {
  //     ...state,
  //     user: action.user,
  //     userAuthCheck: false
  //   };
  // }),
  //
  // on(AuthActions.registerFailure, (state, action) => {
  //   return {
  //     ...state,
  //     token:         undefined,
  //     user:          undefined,
  //     userAuthCheck: false,
  //   };
  // }),

  on(AuthActions.logout, (state, action) => {
    return {
      ...state,
      user:          undefined,
      userAuthCheck: false
    };
  }),

  on(AuthActions.logoutSuccess, (state, action) => {
    return {
      ...state,
      token:         undefined,
      user:          undefined,
      userAuthCheck: false
    };
  }),

  on(AuthActions.updateSuccess, (state, action) => {
    return {
      ...state,
      user:          action.user,
      userAuthCheck: false
    };
  }),
);


