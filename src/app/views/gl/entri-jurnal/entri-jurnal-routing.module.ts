import { Injectable, NgModule } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JurnalEntry } from 'src/app/models/jurnal.model';
import { AccJurnalService } from 'src/app/services/acc-jurnal.service';
import { EntriJurnalComponent } from './entri-jurnal.component';

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

export const entriJournalRoutes: Routes = [
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
];
