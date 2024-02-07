import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {
  BsDatepickerModule,
  BsDaterangepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './containers';
const APP_CONTAINERS = [DefaultLayoutComponent];

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import 3rd party components
import { SharedModule } from './shared/shared.module';
import { AppStoreModule } from './store/app-store.module';
import { EntityDataModule, DefaultDataServiceConfig } from '@ngrx/data';
import { entityConfig } from './store/entity-metadata';
import { ErrorComponent } from './containers/error/error.component';
import { MarkAsteriskDirectiveModule } from './shared/directive/mark-asterisk.directive';
import { YesNoPipeModule } from './shared/directive/yes-no.directive';
import { PaginationConfig } from 'ngx-bootstrap/pagination';
import { AlertModule } from 'ngx-bootstrap/alert';
import { Globals } from './shared/global';
import { NgSelectModule } from '@ng-select/ng-select';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: '/api/',
  timeout: 3000, // request timeout
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' }),
    AppStoreModule,
    SharedModule.forRoot(),
    EntityDataModule.forRoot(entityConfig),
    NgSelectModule,
    NgProgressModule.withConfig({
      spinnerPosition: 'left',
      color: '#1abf11',
    }),
    NgProgressHttpModule,
    MarkAsteriskDirectiveModule,
    YesNoPipeModule,
  ],
  declarations: [AppComponent, ErrorComponent, ...APP_CONTAINERS],
  providers: [
    Globals,
    Title,
    BsModalRef,
    {
      provide: DefaultDataServiceConfig,
      useValue: defaultDataServiceConfig,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptor,
      multi: true,
    },
    {
      provide: PaginationConfig,
      useValue: {
        boundaryLinks: true,
        firstText: '&laquo;',
        previousText: '&lsaquo;',
        nextText: '&rsaquo;',
        lastText: '&raquo;',
        maxSize: 1,
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  today: Date;
  constructor(private dpConfig: BsDaterangepickerConfig) {
    this.today = new Date();
    this.dpConfig.minDate = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      2
    );
  }
}
