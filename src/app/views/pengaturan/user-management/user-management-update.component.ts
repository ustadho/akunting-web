import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.model';
import { DataVM } from 'src/app/shared/domain/data-vm.model';

@Component({
  selector: 'app-user-mgmt-update',
  templateUrl: './user-management-update.component.html',
})
export class UserMgmtUpdateComponent implements OnInit {
  user: any;
  languages: any[];
  authorities: any[];
  isSaving: boolean;
  title = 'Tambah User';
  userTypes = ['INTERNAL', 'EMKL', 'CUSTOMER'];
  listEmkl: DataVM[] = [];
  selectTokoPengirims: DataVM[] = [];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
  ) {}

  selectItem(value) {}

  ngOnInit() {
    this.isSaving = false;
    this.route.data.subscribe(({ user }) => {
      console.log('user', user);
      this.user = user.body ? user.body : user;
      this.title = user.body ? 'Update User' : this.title;

      if (this.user.activated == null) {
        this.user.activated = true;
      }
      if (this.user.userType == null) {
        this.user.userType = 'INTERNAL';
      }
    });
    this.authorities = [];
    this.userService.authorities().subscribe((authorities) => {
      this.authorities = authorities;
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    if (this.user.id !== null) {
      this.userService.update(this.user).subscribe(
        (response) => this.onSaveSuccess(response),
        () => this.onSaveError()
      );
    } else {
      this.userService.create(this.user).subscribe(
        (response) => {
          this.onSaveSuccess(response);
        },
        () => this.onSaveError()
      );
    }
  }

  private onSaveSuccess(result) {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError() {
    this.isSaving = false;
  }
}
