import {
  Routes,
} from '@angular/router';

import { DefaultLayoutComponent } from 'src/app/containers';
import { UserRouteAccessService } from 'src/app/core/auth/user-route-access-service';

const AKUNTING_ROUTES = [
  {
    path: '',
    redirectTo: 'daftar',
    pathMatch: 'full',
  },
  {
    path: 'daftar',
    loadChildren: () =>
      import('../views/daftar/daftar.module').then((m) => m.DaftarModule),
    data: { title: 'Daftar' },
  },
  {
    path: 'aktivitas',
    loadChildren: () =>
      import('../views/akunting/aktivitas/aktivitas.module').then((m) => m.AktivitasModule),
    data: { title: 'Aktivitas' },
  },
];

export const akuntingState: Routes = [
  {
    path: '',
    data: {
      authorities: ["ROLE_AKUNTING"],
    },
    canActivate: [UserRouteAccessService],
    children: AKUNTING_ROUTES,
  },
];
