import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, authFeatureKey } from './auth.reducer';


export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);


export const isLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => state.userAuthCheck ? undefined : !!state.user
);

export const role = createSelector(
  selectAuthState,
  (state: AuthState) => state.role
);

export const authUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const userAuthCheck = createSelector(
  selectAuthState,
  (state: AuthState) => state.userAuthCheck
);



