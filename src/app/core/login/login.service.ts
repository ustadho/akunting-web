import { Injectable } from '@angular/core';

import { AccountService } from '../auth/account.service';
import { AuthServerProvider } from '../auth/auth-jwt.service';
import { Router } from '@angular/router';
import * as AuthActions from '../login/store/auth.action'
import * as fromApp from 'src/app/store/app.reducer';

import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  login(credentials, callback?) {
    const cb = callback || function () {};

    return new Promise((resolve, reject) => {
      this.authServerProvider.login(credentials).subscribe(
        (data) => {
          this.accountService.identity(true).then((account) => {
            
            
            resolve(data);
          });
          return cb();
        },
        (err) => {
          this.store.dispatch(
            AuthActions.authenticationFail()
          );
          this.logout();
          reject(err);
          return cb(err);
        }
      );
    });
  }

  loginWithToken(jwt, rememberMe) {
    return this.authServerProvider.loginWithToken(jwt, rememberMe);
  }

  logout() {
    this.authServerProvider.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
    this.accountService.authenticate(null);
  }
}
