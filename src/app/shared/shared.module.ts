import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { UbahPasswordComponent } from './ubah-password/ubah-password.component';
import { PasswordStrengthBarComponent } from './ubah-password/password-strength-bar.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { OnlyNumberDirective } from './directive/only-number.directive';
import { CurrencyInputDirective } from './directive/currency-input.directive';

@NgModule({
  declarations: [
    LoginComponent,
    UbahPasswordComponent,
    PasswordStrengthBarComponent,
    CurrencyInputDirective,
    OnlyNumberDirective
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, AlertModule],
  exports: [CommonModule, ReactiveFormsModule, FormsModule, LoginComponent,
    CurrencyInputDirective,
    OnlyNumberDirective],
  providers: [CurrencyPipe]
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
    };
  }
}
