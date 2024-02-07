import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';
// import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';

import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.model';
import { AccountService } from '../../../core/auth/account.service';
import { UserManagementComponent } from './user-management.component';
import { JhiResolvePagingParams } from 'src/app/core/service/resolve-paging-params.service';
import { UserMgmtDetailComponent } from './user-management-detail.component';
import { UserMgmtUpdateComponent } from './user-management-update.component';
import { UserRouteAccessService } from 'src/app/core/auth/user-route-access-service';

// import { UserMgmtComponent } from './user-management.component';
// import { UserMgmtDetailComponent } from './user-management-detail.component';
// import { UserMgmtUpdateComponent } from './user-management-update.component';

@Injectable({ providedIn: 'root' })
export class UserResolve implements CanActivate {
  constructor(private accountService: AccountService) { }

  canActivate() {
    return this.accountService.identity().then(account => this.accountService.hasAnyAuthority(['ROLE_ADMIN']));
  }
}

@Injectable({ providedIn: 'root' })
export class UserMgmtResolve implements Resolve<any> {
  constructor(private service: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params['login'] ? route.params['login'] : null;
    if (id) {
      return this.service.find(id);
    }
    return new User();
  }
}

export const userMgmtRoute: Routes = [
  {
    path: 'user-management',
    component: UserManagementComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      title: 'Manajemen User',
      pageTitle: 'userManagement.home.title',
      defaultSort: 'id,asc',
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'user-management/:login/view',
    component: UserMgmtDetailComponent,
    resolve: {
      user: UserMgmtResolve
    },
    data: {
      title: 'View - Manajemen User',
      pageTitle: 'userManagement.home.title'
    }
  },
  {
    path: 'user-management/new',
    component: UserMgmtUpdateComponent,
    resolve: {
      user: UserMgmtResolve
    },
    data: {
      title: 'Tambah User',
    }
  },
  {
    path: 'user-management/:login/edit',
    component: UserMgmtUpdateComponent,
    resolve: {
      user: UserMgmtResolve
    },
    data: {
      title: 'Edit User',
    }
  }
];
