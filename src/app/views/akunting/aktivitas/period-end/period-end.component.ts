import { Component, OnInit } from '@angular/core';
import { AccCoaService } from '../../../../services/acc-coa.service';
import { AccPeriodEndService } from '../../../../services/acc-period-end.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ITEMS_PER_PAGE } from 'src/app/shared/constants/pagination.constants';
import { PeriodEndDialogComponent } from './period-end-dialog/period-end-dialog.component';

@Component({
  selector: 'app-period-end',
  templateUrl: './period-end.component.html',
  styleUrls: ['./period-end.component.css']
})
export class PeriodEndComponent implements OnInit {
  bsModalRef: BsModalRef;
  maxSize = 10;
  queryCount: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  routeData: any;
  totalItems: any;
  listData: any[];
  title: string;
  pageTitle: string;

  constructor(
    private service: AccPeriodEndService,
    private toastr: ToastrService,
    private bsModalService: BsModalService,
    private router: Router,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute,
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
    this.eventManager.subscribe('savePeriodEndSuccess', message => {
      this.loadAll();
    });

    setTimeout(()=> {this.transition()}, 500)
  }

  transition() {
    this.router.navigate(['/akunting/aktivitas/period-end'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
      },
    });
    this.loadAll();
  }

  loadPage(event: PageChangedEvent): void {
    if (event.page !== this.previousPage) {
      this.page = event.page;
      this.previousPage = event.page;
      this.transition();
    }
  }

  loadAll() {
    this.service
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<any[]>) => this.onSuccess(res.body, res.headers),
        (res: HttpResponse<any>) => this.onError(res)
      );
  }

  add() {
    const initialState = {
      data: null,
      title: 'Period End'
    };
    this.bsModalRef = this.bsModalService.show(PeriodEndDialogComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-md');
  }

  refresh() {
    this.loadAll()
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    return result;
  }

  trackIdentity(index, vm: any) {
    return vm.id;
  }

  private onSuccess(data, headers) {
    this.totalItems = data.totalElements;
    this.queryCount = this.totalItems;
    this.listData = data.content;
  }

  private onError(error) {
    if (error !== null) {
      console.log(error)
      this.toastr.error(error.error, error.message, null);
    }
  }

}
