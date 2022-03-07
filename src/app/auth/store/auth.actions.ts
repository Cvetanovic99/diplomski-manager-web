import { createAction, props } from '@ngrx/store';
import { User } from '../../_shared/models/Auth/User';

export const authInit = createAction(
  '[Auth] User.ts Init'
);

export const getCurrentUser = createAction(
  '[Auth] After user login or on init',
  props<{ role: string }>()
);

export const setCurrentUserRole = createAction(
  '[Auth] Set user role',
  props<{ role: string }>()
);

export const login = createAction(
  '[Login Page] User.ts Login',
  props<{ user: { email: string, password: string } }>()
);

export const loginSuccess = createAction(
  '[Auth] User.ts Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

// export const register = createAction(
//   '[Register Page] User.ts Register',
//   props<{ user: { email: string, password: string, confirmedPassword: string } }>()
// );
//
// export const registerSuccess = createAction(
//   '[Register] User.ts Register Success',
//   props<{ user: User }>()
// );
//
// export const registerFailure = createAction(
//   '[Register] Register Failure',
//   props<{ error: any }>()
// );

export const logout = createAction(
  '[Auth] Logout'
);

export const logoutSuccess = createAction(
  '[Auth] Logout Success'
);

export const updateSuccess = createAction(
  '[Auth] User.ts Edit Success',
  props<{ user: User }>()
);
