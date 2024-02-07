import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/core/login/login.service';
import { Router } from '@angular/router';
import { StateStorageService } from 'src/app/core/auth/state-storage.service';
import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from '../../core/login/store/auth.action'
import * as AuthSelector from 'src/app/core/login/store/auth.selector';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Account } from 'src/app/core/user/account.model';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
})
export class LoginComponent implements OnInit{
  authenticationError: boolean;
  password: string;
  rememberMe: boolean;
  username: string;
  credentials: any;
  account$: Observable<Account>;
  currentAccount: Account;
  constructor(
    private loginService: LoginService,
    private stateStorageService: StateStorageService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {
    this.account$ = this.store.pipe(select(AuthSelector.selectCurrentAccount));
    this.account$.subscribe((data) => {
      this.currentAccount = data;
    });
  }

  login() {
    this.loginService
      .login({
        username: this.username,
        password: this.password,
        rememberMe: this.rememberMe,
      })
      .then((token: string) => {

        // --get user authorities like: "ROLE_ADMIN,ROLE_AKUNTING
        // --temporarily not in used

        // let jwtData = token.split('.')[1];
        // let decodedJwtJsonData = window.atob(jwtData);
        // let decodedJwtData = JSON.parse(decodedJwtJsonData);

        this.authenticationError = false;

        // previousState was set in the authExpiredInterceptor before being redirected to login modal.
        // since login is successful, go to stored previousState and clear previousState
        const redirect = this.stateStorageService.getUrl();
        this.store.select('auth').subscribe(data => {
          this.stateStorageService.storeUrl(null);
          this.router.navigate([redirect]);
        });
      })
      .catch((err) => {
        this.authenticationError = true;
      });
  }

 ngOnInit() {
  this.store.dispatch(AuthActions.logout());
 }
}
