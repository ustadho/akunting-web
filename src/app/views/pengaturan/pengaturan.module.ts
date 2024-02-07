import { pengaturanState } from './pengaturan.route';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxWigModule, NgxWigComponent, BUTTONS } from 'ngx-wig';
import { YesNoPipeModule } from 'src/app/shared/directive/yes-no.directive';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { JhiSortModule } from 'src/app/shared/directive/sort-by.directive';
import { DefaultAkunComponent } from './default-akun/default-akun.component';
import { MatauangComponent } from './default-akun/matauang/matauang.component';
import { ItemComponent } from './default-akun/item/item.component';
import { UserManagementComponent } from '../pengaturan/user-management/user-management.component';
import { UserMgmtDetailComponent } from '../pengaturan/user-management/user-management-detail.component';
import { UserMgmtUpdateComponent } from '../pengaturan/user-management/user-management-update.component';

const MY_PLUGIN = {
  edithtml: {
    label: 'Custom button',
    title: 'Custom button',
    command: (ctx: NgxWigComponent) => {
      alert('This is a custom button');
    },
    styleClass: 'nw-button',
    icon: 'icon-custom',
  },
};

@NgModule({
  declarations: [
    DefaultAkunComponent,
    MatauangComponent,
    ItemComponent,
    UserManagementComponent,
    UserMgmtDetailComponent,
    UserMgmtUpdateComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(pengaturanState),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    NgSelectModule,
    TabsModule,
    PaginationModule,
    NgxWigModule,
    YesNoPipeModule,
    JhiSortModule,
  ],
  entryComponents: [
  ],
  providers: [{ provide: BUTTONS, multi: true, useValue: MY_PLUGIN }],
})
export class PengaturanModule {}
