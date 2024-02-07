import { Injectable, NgModule } from '@angular/core';
import { Routes, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccAPPaymentService } from 'src/app/services/ap-payment.service';
import { BuktiKasBank, JurnalEntry } from '../../models/jurnal.model';
import { AccJurnalService } from 'src/app/services/acc-jurnal.service';
import { buktiKasRouting } from './bukti-kas/bukti-kas-routing.module';
import { entriJournalRoutes } from './entri-jurnal/entri-jurnal-routing.module';
import { UserRouteAccessService } from 'src/app/core/auth/user-route-access-service';
import { EntriJurnalComponent } from './entri-jurnal/entri-jurnal.component';
import { ReportAkuntingComponent } from './report-akunting/report-akunting.component';

@Injectable({ providedIn: 'root' })
export class BuktiKasBankResolve implements Resolve<any> {
  constructor(private service: AccJurnalService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      const d = this.service.findBuktiKasById(id);
      d.subscribe((data) => {});
      return d;
    }
    return new BuktiKasBank();
  }
}

@Injectable({ providedIn: 'root' })
export class JurnalUmumResolve implements Resolve<any> {
  constructor(private service: AccJurnalService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      const d = this.service.findById(id);
      d.subscribe((data) => {});
      return d;
    }
    return new JurnalEntry();
  }
}

@Injectable({ providedIn: 'root' })
export class APPaymentResolve implements Resolve<any> {
  constructor(private service: AccAPPaymentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.findById(id);
    }
    return null;
  }
}

const GL_ROUTES = [
  {
    path: '',
    redirectTo: 'entri-jurnal',
    pathMatch: 'full',
  },
  {
    path: 'entri-jurnal',
    component: EntriJurnalComponent,
    data: {
      title: 'Entri Jurnal',
      pageTitle: 'Entri Jurnal',
      tipe: "JV",
      tipeTransaksi: "Bukti Jurnal Umum",
      authorities: ['ROLE_AKUNTING'],
    },
  },
  {
    path: 'entri-jurnal/:id',
    component: EntriJurnalComponent,
    data: {
      title: 'Edit Jurnal Umum',
      pageTitle: 'Edit Jurnal Umum',
      authorities: ['ROLE_AKUNTING'],
      tipe: "JV",
      tipeTransaksi: "Bukti Jurnal Umum",
    },
    resolve: {
      data: JurnalUmumResolve,
    },
  },
  ...buktiKasRouting,
  {
    path: 'report',
    component: ReportAkuntingComponent,
    data: {
      title: 'Laporan Keuangan',
      pageTitle: 'Laporan Keuangan',
      authorities: ['ROLE_AKUNTING'],
    },
  },
]

export const glRoutes: Routes = [
  {
    path: '',
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_ACCOUNTING']
    },
    canActivate: [UserRouteAccessService],
    children: GL_ROUTES
  }
];

