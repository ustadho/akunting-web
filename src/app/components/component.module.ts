import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputPencarianAkunComponent } from './input-pencarian-akun/input-pencarian-akun.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxWigModule } from 'ngx-wig';
import { YesNoPipeModule } from 'src/app/shared/directive/yes-no.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LookupAkunComponent } from './modals/lookup-akun/lookup-akun.component';

@NgModule({
  declarations: [
    InputPencarianAkunComponent,
    LookupAkunComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    NgSelectModule,
    TabsModule,
    PaginationModule,
    NgxWigModule,
    YesNoPipeModule
  ],
  exports: [
    InputPencarianAkunComponent,
    LookupAkunComponent,
  ]
})
export class ComponentModule { }
