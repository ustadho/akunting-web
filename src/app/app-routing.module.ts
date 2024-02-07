import { errorRoute } from './containers/error/error.route';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { DefaultLayoutComponent } from './containers';
import { LoginComponent } from './shared/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'dashboard',
    component: DefaultLayoutComponent,
    loadChildren: () =>
      import('./views/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    data: { title: 'Dashboard' },
  },
  {
    path: 'gl',
    component: DefaultLayoutComponent,
    loadChildren: () =>
      import('./views/gl/gl.module').then((m) => m.GlModule),
    data: { title: 'Buku Besar' },
  },
  {
    path: 'daftar',
    component: DefaultLayoutComponent,
    loadChildren: () =>
      import('./views/daftar/daftar.module').then((m) => m.DaftarModule),
    data: { title: 'Laporan' },
  },
  {
    path: 'pengaturan',
    component: DefaultLayoutComponent,
    loadChildren: () =>
      import('./views/pengaturan/pengaturan.module').then(
        (m) => m.PengaturanModule
      ),
    data: { title: 'Pengaturan' },
  },
  ...errorRoute,
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
