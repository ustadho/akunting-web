import { Component, OnInit } from '@angular/core';
import { AccAPService } from '../../../services/ap-invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITEMS_PER_PAGE } from 'src/app/shared/constants/pagination.constants';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FixAssetService } from '../../../services/fixasset.service';
import { HttpResponse } from '@angular/common/http';
import { FADepreciationMethodService } from '../../../services/fa-depreciation-method.service';
import { FATypeService } from '../../../services/fa-tipe.service';
import { AccReportService } from '../../../services/acc-report.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-fixasset',
  templateUrl: './fixasset-list.component.html',
  styleUrls: ['./fixasset-list.component.css']
})
export class FixAssetListComponent implements OnInit {
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
  listFixassetType: any[];
  listDepartment: any[];
  listDepreciationMethod: any[];
  filterForm: any;
  title: string;
  pageTitle: string;
  bsModalRef: BsModalRef;

  constructor(
    private service: FixAssetService,
    private faDepreciationService: FADepreciationMethodService,
    private faTypeService: FATypeService,
    private accReportService: AccReportService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      usageDateFilter: [false, []],
      usageDate1: [new Date(), []],
      usageDate2: [new Date(), []],
      purchaseDateFilter: [false, []],
      purchaseDate1: [new Date(), []],
      purchaseDate2: [new Date(), []],
      code: [''],
      faTypeId: [null],
      depreciationMethodId: [null],
      intangible: ['A', [Validators.required]],
      fiscal: ['A', [Validators.required]],
      desc: [''],
      processed: [true],
      stopped: [false],
    });

    this.faDepreciationService.findAll().subscribe(
      (res: any[]) => {
        this.listDepreciationMethod = res;
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );

    this.faTypeService.findAll().subscribe(
      (res: any[]) => {
        this.listFixassetType = res;
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params !== undefined && params !== null) {
        if (params.tg1 !== null && params.tg1 !== undefined) {
          this.filterForm
            .get('usageDate1')
            .setValue(params.tg1 === '' ? new Date() : new Date(params.tg1));
        }
        if (params.tg2 !== null && params.tg2 !== undefined) {
          this.filterForm
            .get('usageDate2')
            .setValue(params.tg2 === '' ? new Date() : new Date(params.tg2));
        }
        if (params.pd1 !== null && params.pd1 !== undefined) {
          this.filterForm
            .get('purchaseDate1')
            .setValue(params.pd1 === '' ? new Date() : new Date(params.pd1));
        }
        if (params.pd2 !== null && params.pd2 !== undefined) {
          this.filterForm
            .get('usageDate2')
            .setValue(params.pd2 === '' ? new Date() : new Date(params.pd2));
        }
        if (params.nomor !== null && params.nomor !== undefined) {
          this.filterForm.get('nomor').setValue(params.nomor);
        }
        if (params.desc !== null && params.desc !== undefined) {
          this.filterForm.get('desc').setValue(params.desc);
        }
        if (params.faTypeId !== null && params.faTypeId !== undefined && params.faTypeId !== 0) {
          this.filterForm.get('faTypeId').setValue(params.faTypeId === '' || params.faTypeId === '0'? null: parseInt(params.faTypeId));
        }
        if (params.dpr !== null && params.dpr !== undefined && params.dpr !== 0) {
          this.filterForm.get('depreciationMethodId').setValue(params.dpr === '' || params.dpr === '0'? null: parseInt(params.dpr));
        }
        if (params.usageDateFilter !== null && params.usageDateFilter !== undefined) {
          this.filterForm.get('usageDateFilter').setValue(params.usageDateFilter==='true');
        }
        if (params.purchaseDateFilter !== null && params.purchaseDateFilter !== undefined) {
          this.filterForm.get('purchaseDateFilter').setValue(params.purchaseDateFilter==='true');
        }
      }
    });

    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe((params) => {
      this.page = params.pagingParams.page;
      this.title = params.title;
      this.pageTitle = params.pageTitle;
      this.previousPage = params.pagingParams.page;
      this.reverse = params.pagingParams.ascending;
      this.predicate = params.pagingParams.predicate;
    });

    setTimeout(()=> {this.transition()}, 500)
  }

  loadPage(event: PageChangedEvent): void {
    if (event.page !== this.previousPage) {
      this.page = event.page;
      this.previousPage = event.page;
      this.transition();
    }
  }

  onPrint(d) {
    this.service.getReport('print', {id: d.id}, 'pdf')
  }

  previewGlHistory(id) {
    this.accReportService.getReportGlHistory(id)
  }

  transition() {
    this.router.navigate(['/akunting/daftar/fixasset/list'], {
      queryParams: {
        startUsageDate: this.filterForm.value.usageDateFilter? moment(this.filterForm.value.usageDate1).format('YYYY-MM-DD'): '',
        endUsageDate: this.filterForm.value.usageDateFilter? moment(this.filterForm.value.usageDate2).format('YYYY-MM-DD'): '',
        usageDateFilter: this.filterForm.value.usageDateFilter?? true,
        startPurchaseDate: this.filterForm.value.purchaseDateFilter? moment(this.filterForm.value.purchaseDate1).format('YYYY-MM-DD'): '',
        endPurchaseDate: this.filterForm.value.purchaseDateFilter? moment(this.filterForm.value.purchaseDate2).format('YYYY-MM-DD'): '',
        purchaseDateFilter: this.filterForm.value.purchaseDateFilter?? true,
        code:
          this.filterForm.value.code === undefined
            ? ''
            : this.filterForm.value.code,
        desc:
          this.filterForm.value.desc === undefined
            ? ''
            : this.filterForm.value.desc,
        page: this.page,
        size: this.itemsPerPage,
        typeId: this.filterForm.value.faTypeId ?? 0,
        depreciationMethodId: this.filterForm.value.depreciationMethodId ?? 0,
        intangible: this.filterForm.value.intangible,
        fiscal: this.filterForm.value.fiscal,
        processed: this.filterForm.value.processed,
        stopped: this.filterForm.value.stopped,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
      },
    });
    this.loadAll();
  }

  loadAll() {
    this.service
      .query({
        startUsageDate: this.filterForm.value.usageDateFilter
          ? moment(this.filterForm.value.usageDate1).format('YYYY-MM-DD')
          : '',
        endUsageDate: this.filterForm.value.usageDateFilter
          ? moment(this.filterForm.value.usageDate2).format('YYYY-MM-DD')
          : '',
        startPurchaseDate: this.filterForm.value.purchaseDateFilter
          ? moment(this.filterForm.value.purchaseDate1).format('YYYY-MM-DD')
          : '',
        endPurchaseDate: this.filterForm.value.purchaseDateFilter
          ? moment(this.filterForm.value.purchaseDate2).format('YYYY-MM-DD')
          : '',
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        typeId: this.filterForm.value.faTypeId ?? 0,
        depreciationMethodId: this.filterForm.value.depreciationMethodId ?? 0,
        intangible: this.filterForm.value.intangible,
        fiscal: this.filterForm.value.fiscal,
        processed: this.filterForm.value.processed,
        stopped: this.filterForm.value.stopped,
        code:
          this.filterForm.value.code === undefined
            ? ''
            : this.filterForm.value.code,
        desc:
          this.filterForm.value.desc === undefined
            ? ''
            : this.filterForm.value.desc,
      })
      .subscribe(
        (res: HttpResponse<any[]>) => this.onSuccess(res.body, res.headers),
        (res: HttpResponse<any>) => this.onError(res)
      );
  }

  add() {
    this.router.navigate([`/akunting/daftar/fixasset`], { relativeTo: this.activatedRoute });
  }

  edit(a: any) {
    this.router.navigate([`/akunting/daftar/fixasset/${a.id}`], { relativeTo: this.activatedRoute });
  }

  previewList() {
    const param = {
      ip: 1,
      type: this.filterForm.value.faTypeId ?? 0,
      dprm: this.filterForm.value.depreciationMethodId ?? 0,
      int: this.filterForm.value.intangible,
      fis: this.filterForm.value.fiscal,
      prs: this.filterForm.value.processed,
      dis: this.filterForm.value.stopped,
      pd1: this.filterForm.value.purchaseDateFilter==true? formatDate(this.filterForm.get('purchaseDate1').value, 'yyyy-MM-dd', 'en_US'): '',
      pd2: this.filterForm.value.purchaseDateFilter==true? formatDate(this.filterForm.get('purchaseDate2').value, 'yyyy-MM-dd', 'en_US'): '',
      ud1: this.filterForm.value.purchaseDateFilter==true? formatDate(this.filterForm.get('usageDate1').value, 'yyyy-MM-dd', 'en_US'): '',
      ud2: this.filterForm.value.purchaseDateFilter==true? formatDate(this.filterForm.get('usageDate2').value, 'yyyy-MM-dd', 'en_US'): '' ,
    }
    this.service.getReport('list', param, 'pdf')
  }

  delete(a: any) {
    Swal.fire({
      title: `Hapus Fix Asset`,
      text: `Anda yakin untuk menghapus data '${a.code}' ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya Benar',
    }).then((result) => {
      if (result.value) {
        this.service.delete(a.id).subscribe((response) => {
          this.loadAll();
        });
      }
    });
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    // if (this.predicate !== 'nomor') {
    //   result.push('nomor');
    // }
    return result;
  }

  private onSuccess(data, headers) {
    this.totalItems = data.totalElements;
    this.queryCount = this.totalItems;
    this.listData = data.content;
  }

  private onError(error) {
    if (error !== null) {
      console.log(error);
      this.toastr.error(error.error, error.message, null);
    }
  }

  trackIdentity(index, vm: any) {
    return vm.id;
  }

}
