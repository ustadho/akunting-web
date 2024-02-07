import { Injectable, NgModule } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BuktiKasBank } from 'src/app/models/jurnal.model';
import { AccJurnalService } from 'src/app/services/acc-jurnal.service';
import { BuktiKasComponent } from './bukti-kas.component';

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

export const buktiKasRouting: Routes = [
  {
    path: 'bkm',
    component: BuktiKasComponent,
    data: {
      title: 'Bukti Kas Masuk',
      pageTitle: 'Bukti Mas Masuk Baru',
      authorities: ['ROLE_AKUNTING'],
      tipe: "DPT",
      tipeTransaksi: "Penerimaan",
    },
  },
  {
    path: 'bkm/:id',
    component: BuktiKasComponent,
    data: {
      title: 'Edit Bukti Kas Masuk',
      authorities: ['ROLE_AKUNTING'],
      tipe: "DPT",
      tipeTransaksi: "Penerimaan",
    },
    resolve: {
      data: BuktiKasBankResolve,
    },
  },
  {
    path: 'bkk',
    component: BuktiKasComponent,
    data: {
      title: 'Bukti Kas Keluar',
      pageTitle: 'Bukti Kas Keluar Baru',
      authorities: ['ROLE_AKUNTING'],
      tipe: "PMT",
      tipeTransaksi: "Pembayaran",
    },
  },
  {
    path: 'bkk/:id',
    component: BuktiKasComponent,
    data: {
      title: 'Edit Bukti Kas Keluar',
      authorities: ['ROLE_AKUNTING'],
      tipe: "PMT",
      tipeTransaksi: "Pembayaran",
    },
    resolve: {
      data: BuktiKasBankResolve,
    },
  },
];
