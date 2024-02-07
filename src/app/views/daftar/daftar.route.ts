import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';

import { JhiResolvePagingParams } from 'src/app/core/service/resolve-paging-params.service';
import { UserRouteAccessService } from 'src/app/core/auth/user-route-access-service';
import { DaftarAkunComponent } from './daftar-akun/daftar-akun.component';
import { DaftarJurnalComponent } from './daftar-jurnal/daftar-jurnal.component';
import { KodePajakComponent } from './kode-pajak/kode-pajak.component';
import { FaTipePajakComponent } from './fa-tipe-pajak/fa-tipe-pajak.component';
import { FaTipeComponent } from './fa-tipe/fa-tipe.component';
import { DepartmentComponent } from './department/department.component';
import { FixAssetListComponent } from './fixasset/fixasset-list.component';
import { FixAssetFormComponent } from './fixasset/fixasset-form/fixasset-form.component';
import { Injectable } from '@angular/core';
import { FixAssetService } from '../../services/fixasset.service';


@Injectable({ providedIn: 'root' })
export class FixAssetResolve implements Resolve<any> {
  constructor(private service: FixAssetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.findById(id);
    }
    return null;
  }
}

const AKUNTING_DAFTAR_ROUTES = [
  {
    path: '',
    redirectTo: 'daftar-akun',
    pathMatch: 'full',
  },
  {
    path: 'daftar-akun',
    component: DaftarAkunComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      title: 'Daftar Akun',
      pageTitle: 'Daftar Akun',
      defaultSort: 'nama,desc',
      authorities: ['ROLE_AKUNTING'],
    },
  },
  {
    path: 'bukti-jurnal',
    component: DaftarJurnalComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      title: 'Daftar Bukti Jurnal',
      pageTitle: 'Daftar Bukti Jurnal',
      defaultSort: 'tanggal,desc',
      source: "JV",
      sourceName: "Bukti Jurnal Umum",
      authorities: ['ROLE_AKUNTING'],
    },
  },
  {
    path: 'bkk',
    component: DaftarJurnalComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      title: 'Daftar Bukti Kas Keluar',
      pageTitle: 'Daftar Bukti Kas Keluar',
      defaultSort: 'tanggal,desc',
      source: "PMT",
      sourceName: "Pembayaran",
      authorities: ['ROLE_AKUNTING'],
    },
  },
  {
    path: 'bkm',
    component: DaftarJurnalComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      title: 'Daftar Bukti Kas Masuk',
      pageTitle: 'Daftar Bukti Kas Masuk',
      defaultSort: 'tanggal,desc',
      source: "DPT",
      sourceName: "Penerimaan",
      authorities: ['ROLE_AKUNTING'],
    },
  },
  {
    path: 'kode-pajak',
    component: KodePajakComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      title: 'Kode Pajak',
      pageTitle: 'Kode Pajak',
      defaultSort: 'nama,asc',
      authorities: ['ROLE_AKUNTING'],
    },
  },
  {
    path: 'fa-tipe-pajak',
    component: FaTipePajakComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      title: 'Tipe Aktiva Tetap Pajak',
      pageTitle: 'Tipe Aktiva Tetap Pajak',
      defaultSort: 'description,desc',
      authorities: ['ROLE_AKUNTING'],
    },
  },
  {
    path: 'fa-tipe',
    component: FaTipeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      title: 'Tipe Aktiva Tetap',
      pageTitle: 'Tipe Aktiva Tetap',
      defaultSort: 'description,desc',
      authorities: ['ROLE_AKUNTING'],
    },
  },
  {
    path: 'fixasset/list',
    component: FixAssetListComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      title: 'Daftar Aktiva Tetap',
      pageTitle: 'Daftar Aktiva Tetap',
      defaultSort: 'code,desc',
      authorities: ['ROLE_AKUNTING'],
    },
  },
  {
    path: 'fixasset',
    component: FixAssetFormComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      title: 'Aktiva Tetap',
      pageTitle: 'Daftar Aktiva Tetap',
      authorities: ['ROLE_AKUNTING'],
    },
  },
  {
    path: 'fixasset/:id',
    component: FixAssetFormComponent,
    data: {
      title: 'Edit Fix Asset',
      pageTitle: 'Edit Fix Asset',
      authorities: ['ROLE_AKUNTING'],
    },
    resolve: {
      data: FixAssetResolve,
    },
  },
  {
    path: 'department',
    component: DepartmentComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      title: 'Departemen',
      pageTitle: 'Departemen',
      defaultSort: 'name,desc',
      authorities: ['ROLE_AKUNTING'],
    },
  },
];

export const daftarAkuntingState: Routes = [
  {
    path: '',
    data: {
      authorities: ['ROLE_AKUNTING'],
    },
    canActivate: [UserRouteAccessService],
    children: AKUNTING_DAFTAR_ROUTES,
  },
];
