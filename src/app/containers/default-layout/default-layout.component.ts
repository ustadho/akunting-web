import { Component } from '@angular/core';
import { navItems } from '../../_nav';
import { LoginService } from 'src/app/core/login/login.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
// import * as AuthActions from 'src/app/core/login/store/auth.action';
import * as fromApp from 'src/app/store/app.reducer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = [];
  public currentAccount: any = null;

  constructor(private loginService: LoginService, private router: Router, private store: Store<fromApp.AppState>) {

    this.store.select('auth').subscribe(async data => {
      this.currentAccount = await data.currentAccount;
      if( Boolean(this.currentAccount) ) {
        this.navItems = navItems.filter(menu => {

          const b = !menu.attributes || !Boolean(menu.attributes.authorities) || _.intersection(menu.attributes.authorities, this.currentAccount.authorities).length > 0;
          if(menu.children && menu.children.length > 0) {
            const children = menu.children.filter(menuSub => {

              const bt = !menuSub.attributes || !Boolean(menuSub.attributes.authorities) || _.intersection(menuSub.attributes.authorities, this.currentAccount.authorities).length > 0;
              return bt;
            });
            menu.children = children;
          }
          return b;
        })

      }

    });
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.loginService.logout();
  }
}
