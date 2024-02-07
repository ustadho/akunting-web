import { PageChangedEvent } from 'ngx-bootstrap/pagination/public_api';
// import { JhiAlertService } from 'ng-jhipster';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/core/auth/account.service';
import { HttpResponse } from '@angular/common/http';
import { User } from 'src/app/core/user/user.model';
import { ITEMS_PER_PAGE } from 'src/app/shared/constants/pagination.constants';
import swal from 'sweetalert2';

@Component({
  templateUrl: 'user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  currentAccount: any;
  users: User[];
  error: any;
  success: any;
  routeData: any;
  links: any;
  totalItems: any;
  queryCount: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;

  constructor(
    private userService: UserService,
    // private alertService: JhiAlertService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data['pagingParams'].page;
      this.previousPage = data['pagingParams'].page;
      this.reverse = data['pagingParams'].ascending;
      this.predicate = data['pagingParams'].predicate;
    });
  }

  ngOnInit(): void {
    this.accountService.identity().then(account => {
      this.currentAccount = account;
      this.loadAll();
      this.registerChangeInUsers();
    });
  }

  ngOnDestroy() {
    this.routeData.unsubscribe();
  }

  registerChangeInUsers() {
    // this.eventManager.subscribe('userListModification', response => this.loadAll());
  }

  setActive(user, isActivated) {
    user.activated = isActivated;

    this.userService.update(user).subscribe(response => {
      if (response.status === 200) {
        this.error = null;
        this.success = 'OK';
        this.loadAll();
      } else {
        this.success = null;
        this.error = 'ERROR';
      }
    });
  }

  loadAll() {
    this.userService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<User[]>) => this.onSuccess(res.body, res.headers),
        (res: HttpResponse<any>) => this.onError(res.body)
      );
  }

  trackIdentity(index, item: User) {
    return item.id;
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  loadPage(event: PageChangedEvent) {
    if (event.page !== this.previousPage) {
      this.page = event.page;
      this.previousPage = event.page;
      this.transition();
    }
  }

  transition() {
    this.router.navigate(['/admin/user-management'], {
      queryParams: {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    });
    this.loadAll();
  }

  deleteUser(user: User) {
    swal
      .fire({
        title: 'Hapus Pengguna',
        text: `Anda yakin untuk menghapus ' ${user.login}'?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya Benar',
      })
      .then((result) => {
        if (result.value) {
          this.userService.delete(user.login).subscribe(response => {
            this.loadAll();
          });
        }
      });
  }

  private onSuccess(data, headers) {
    // this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = headers.get('X-Total-Count');
    this.queryCount = this.totalItems;
    this.users = data;
  }

  private onError(error) {
    // this.alertService.error(error.error, error.message, null);
  }

}
