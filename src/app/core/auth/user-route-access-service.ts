import { Injectable, isDevMode } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import * as fromApp from 'src/app/store/app.reducer';
import * as authActions from '../../core/login/store/auth.action';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { AccountService } from './account.service';
import { StateStorageService } from './state-storage.service';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: 'root' })
export class UserRouteAccessService implements CanActivate {
  constructor(
    private router: Router,
    private accountService: AccountService,
    private stateStorageService: StateStorageService,
    private eventManager: JhiEventManager,
    private store: Store<fromApp.AppState>
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    const authorities = route.data['authorities'];
    // We need to call the checkLogin / and so the accountService.identity() function, to ensure,
    // that the client has a principal too, if they already logged in by the server.
    // This could happen on a page refresh.
    return this.checkLogin(authorities, state.url);
  }

  checkLogin(authorities: string[], url: string): Promise<boolean> {
    return this.accountService.identity().then((account) => {
      if (!authorities || authorities.length === 0) {
        return true;
      }

      if (account) {
        const hasAnyAuthority = this.accountService.hasAnyAuthority(
          authorities
        );
        if (hasAnyAuthority) {
          return true;
        }
        if (isDevMode()) {
          // console.error('User has not any of required authorities: ', authorities);
        }
        return false;
      }

      this.stateStorageService.storeUrl(url);
      this.router.navigate(['accessdenied']).then(() => {
        // only show the login dialog, if the user hasn't logged in yet
        if (!account) {
          this.router.navigate(['login']);
        }
      });
      return false;
    });
  }
}
