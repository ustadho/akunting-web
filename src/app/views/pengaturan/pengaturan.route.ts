import { Routes } from '@angular/router';

import { JhiResolvePagingParams } from 'src/app/core/service/resolve-paging-params.service';
import { UserRouteAccessService } from 'src/app/core/auth/user-route-access-service';
import { DefaultAkunComponent } from './default-akun/default-akun.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { userMgmtRoute } from './user-management/user-management.route';

const PENGATURAN_ROUTES = [
  {
    path: 'default-akun',
    component: DefaultAkunComponent,
    data: {
      title: 'Atur default Akun',
      pageTitle: 'Pengaturan Default Akun',
      authorities: ['ROLE_AKUNTING'],
    },
  },
  ...userMgmtRoute
];

export const pengaturanState: Routes = [
  {
    path: '',
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_PL', 'ROLE_KEUANGAN', 'ROLE_NOTA'],
    },
    canActivate: [UserRouteAccessService],
    children: PENGATURAN_ROUTES,
  },
];
