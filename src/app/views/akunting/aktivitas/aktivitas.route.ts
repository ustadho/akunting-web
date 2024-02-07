import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';

import { JhiResolvePagingParams } from 'src/app/core/service/resolve-paging-params.service';
import { UserRouteAccessService } from 'src/app/core/auth/user-route-access-service';
import { PeriodEndComponent } from './period-end/period-end.component';

const AKUNTING_AKTIVITAS_ROUTES = [
  {
    path: '',
    redirectTo: 'entri-jurnal',
    pathMatch: 'full',
  },
  {
    path: 'period-end',
    component: PeriodEndComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      title: 'Period End',
      pageTitle: 'Period End',
      defaultSort: 'createdDate,desc',
      authorities: ['ROLE_AKUNTING'],
    },
  },
];

export const aktivitasAkuntingState: Routes = [
  {
    path: '',
    data: {
      authorities: ['ROLE_AKUNTING'],
    },
    canActivate: [UserRouteAccessService],
    children: AKUNTING_AKTIVITAS_ROUTES,
  },
];
