import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { UserRouteAccessService } from 'src/app/core/auth/user-route-access-service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      authorities: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_KEUANGAN', 'ROLE_PL', 'ROLE_NOTA', 'ROLE_'],
      pageTitle: 'Dashboard',
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
