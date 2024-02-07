import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { reportState } from './report.route';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReportApComponent } from './report-ap/report-ap.component';
import { ReportFixassetComponent } from './report-fixasset/report-fixasset.component';

@NgModule({
  declarations: [ReportApComponent, ReportFixassetComponent],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    SharedModule,
    RouterModule.forChild(reportState),
    PaginationModule,
    TypeaheadModule.forRoot(),
    NgSelectModule,
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  entryComponents: [
  ],
})
export class ReportModule { }
