import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaftarAkunComponent } from './daftar-akun/daftar-akun.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxWigModule } from 'ngx-wig';
import { YesNoPipeModule } from 'src/app/shared/directive/yes-no.directive';
import { RouterModule } from '@angular/router';
import { daftarAkuntingState } from './daftar.route';
import { DaftarJurnalComponent } from './daftar-jurnal/daftar-jurnal.component';
import { ButtonModule } from 'primeng/button';
import {TreeTableModule} from 'primeng/treetable';
import { AkunFormComponent } from './daftar-akun/akun-form/akun-form.component';
import { KodePajakComponent } from './kode-pajak/kode-pajak.component';
import { KodePajakFormComponent } from './kode-pajak/kode-pajak-form/kode-pajak-form.component';
import { ComponentModule } from '../../components/component.module';
import { JhiSortModule } from 'src/app/shared/directive/sort-by.directive';
import { FaTipePajakComponent } from './fa-tipe-pajak/fa-tipe-pajak.component';
import { FaTipePajakFormComponent } from './fa-tipe-pajak/fa-tipe-pajak-form/fa-tipe-pajak-form.component';
import { FaTipeComponent } from './fa-tipe/fa-tipe.component';
import { FaTipeFormComponent } from './fa-tipe/fa-tipe-form/fa-tipe-form.component';
import { DepartmentComponent } from './department/department.component';
import { DepartmentFormComponent } from './department/department-form/department-form.component';
import { FixAssetListComponent} from './fixasset/fixasset-list.component';
import { FixAssetFormComponent } from './fixasset/fixasset-form/fixasset-form.component';
import { FixassetFormGeneralComponent } from './fixasset/fixasset-form/fixasset-form-general.component';
import { FixAssetFormPengeluaranComponent } from './fixasset/fixasset-form/fixasset-form-pengeluaran.component';
import { FixassetFormDisposedComponent } from './fixasset/fixasset-form/fixasset-form-disposed/fixasset-form-disposed.component';
import { FixassetFormRevaluationComponent } from './fixasset/fixasset-form/fixasset-form-revaluation/fixasset-form-revaluation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DaftarAkunComponent, DaftarJurnalComponent, AkunFormComponent, KodePajakComponent, KodePajakFormComponent, FaTipePajakComponent, FaTipePajakFormComponent, FaTipeComponent, FaTipeFormComponent, DepartmentComponent, DepartmentFormComponent, FixAssetListComponent, FixAssetFormComponent, FixassetFormGeneralComponent, FixAssetFormPengeluaranComponent, FixassetFormDisposedComponent, FixassetFormRevaluationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(daftarAkuntingState),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    NgSelectModule,
    TabsModule,
    PaginationModule,
    NgxWigModule,
    YesNoPipeModule,
    ButtonModule,
    TreeTableModule,
    ComponentModule,
    JhiSortModule,
  ]
})
export class DaftarModule { }
