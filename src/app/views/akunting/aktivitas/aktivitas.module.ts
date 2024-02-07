import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxWigModule } from 'ngx-wig';
import { YesNoPipeModule } from 'src/app/shared/directive/yes-no.directive';
import { TerbilangModule } from 'src/app/shared/directive/terbilang.directive';
import { aktivitasAkuntingState } from './aktivitas.route';
import { BuktiKasComponent } from '../../gl/bukti-kas/bukti-kas.component';
import { PeriodEndComponent } from './period-end/period-end.component';
import { PeriodEndDialogComponent } from './period-end/period-end-dialog/period-end-dialog.component';

@NgModule({
  declarations: [BuktiKasComponent, PeriodEndComponent, PeriodEndDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(aktivitasAkuntingState),
    SharedModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    NgSelectModule,
    TabsModule,
    PaginationModule,
    NgxWigModule,
    YesNoPipeModule,
    TerbilangModule,
  ]
})
export class AktivitasModule { }
