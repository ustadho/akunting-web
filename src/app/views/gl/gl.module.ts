import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { glRoutes } from './gl.route';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { YesNoPipeModule } from 'src/app/shared/directive/yes-no.directive';
import { TerbilangModule } from 'src/app/shared/directive/terbilang.directive';
import { BuktiKasComponent } from './bukti-kas/bukti-kas.component';
import { EntriJurnalComponent } from './entri-jurnal/entri-jurnal.component';
import { ComponentModule } from 'src/app/components/component.module';
import { ReportAkuntingComponent } from './report-akunting/report-akunting.component';

@NgModule({
  declarations: [
    BuktiKasComponent,
    EntriJurnalComponent,
    ReportAkuntingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(glRoutes),
    FormsModule,
    ReactiveFormsModule,
    ComponentModule,
    SharedModule,
    ModalModule.forRoot(),
    PaginationModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    YesNoPipeModule,
    TerbilangModule,
  ],
})
export class GlModule { }
