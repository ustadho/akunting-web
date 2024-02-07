import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Account } from 'src/app/core/user/account.model';
import * as AuthActions from './auth.action';
import { Action, createReducer, on } from '@ngrx/store';

export interface AuthState {
  currentAccount: Account;
  token: string;
  authError: string;
  loading: boolean;
}

// export const adapter: EntityAdapter<Account> = createEntityAdapter<Account>();

export const initialState: AuthState = {
  currentAccount: null,
  token: null,
  authError: null,
  loading: false
};

const reducer = createReducer(
  initialState,
  on(
    AuthActions.authenticationSuccess,
    (state, payload: { currentAccount: Account; token: string }) => {
      return {
        ...state,
        currentAccount: payload.currentAccount,
        token: payload.token,
        authError: null,
        loading: false
      };
    }
  ),
  on(AuthActions.logout, (state) => ({
    currentAccount: null,
    token: null,
    authError: null,
    loading: false
  })),
  on(AuthActions.authenticationFail, (state) => ({
    currentAccount: null,
    token: null,
    authError: 'Login gagal. Silahkan periksa kembali Username dan password anda!',
    loading: false
  })),
  on(AuthActions.logout, (state) => ({
    currentAccount: null,
    token: null,
    authError: '',
    loading: false
  }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action);
}

export const getCurrentAccount = (state: AuthState) => state.currentAccount;

export const getToken = (state: AuthState) => state.token;
