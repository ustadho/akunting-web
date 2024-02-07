import { Routes } from '@angular/router';

import { JhiResolvePagingParams } from 'src/app/core/service/resolve-paging-params.service';
import { UserRouteAccessService } from 'src/app/core/auth/user-route-access-service';
import { ReportAkuntingComponent } from '../gl/report-akunting/report-akunting.component';
import { ReportApComponent } from './report-ap/report-ap.component';
import { ReportFixassetComponent } from './report-fixasset/report-fixasset.component';

const AKTIVITAS_ROUTES = [
  {
    path: 'pembelian',
    component: ReportApComponent,
    data: {
      title: 'Laporan Pembelian',
      pageTitle: 'Laporan Pembelian',
      authorities: ['ROLE_AKUNTING'],
    },
  },
  {
    path: 'fixasset',
    component: ReportFixassetComponent,
    data: {
      title: 'Laporan Fix Asset',
      pageTitle: 'Laporan Fix Asset',
      authorities: ['ROLE_AKUNTING'],
    },
  },
];

export const reportState: Routes = [
  {
    path: '',
    data: {
      authorities: ['ROLE_ACCOUNTING', 'ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
    children: AKTIVITAS_ROUTES,
  },
];
