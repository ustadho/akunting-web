import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AccountService } from 'src/app/core/auth/account.service';
import { PasswordService } from './ubah-password.service';

@Component({
  selector: 'app-ubah-password',
  templateUrl: './ubah-password.component.html',
  styleUrls: ['./ubah-password.component.css'],
})
export class UbahPasswordComponent implements OnInit {
  doNotMatch = false;
  error = false;
  success = false;
  // account$?: Observable<Account | null>;
  currentAccount: any;

  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    ],
    confirmPassword: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    ],
  });

  constructor(
    private passwordService: PasswordService,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.account$ = this.accountService.identity();
    this.accountService.identity().then((account) => {
      this.currentAccount = account;
    });
  }

  changePassword(): void {
    this.error = false;
    this.success = false;
    this.doNotMatch = false;

    const newPassword = this.passwordForm.get(['newPassword'])!.value;
    if (newPassword !== this.passwordForm.get(['confirmPassword'])!.value) {
      this.doNotMatch = true;
    } else {
      this.passwordService
        .save(newPassword, this.passwordForm.get(['currentPassword'])!.value)
        .subscribe(
          () => (this.success = true),
          () => (this.error = true)
        );
    }
  }
}
