import { Component, OnInit } from '@angular/core';
import { AccTipeJurnalService } from '../../../services/acc-tipe-jurnal';
import { DataVM } from 'src/app/shared/domain/data-vm.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { AccJurnalService } from '../../../services/acc-jurnal.service';
import { ToastrService } from 'ngx-toastr';
import { ITEMS_PER_PAGE } from 'src/app/shared/constants/pagination.constants';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import Swal from 'sweetalert2';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { AccReportService } from '../../../services/acc-report.service';
import { AccPerusahaaanService } from '../../../services/acc-perusahaan.service';

@Component({
  selector: 'app-daftar-jurnal',
  templateUrl: './daftar-jurnal.component.html',
  styleUrls: ['./daftar-jurnal.component.css'],
})
export class DaftarJurnalComponent implements OnInit {
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
  listPerusahaan = [];
  filterForm: any;
  filterTypes : any[] = [];
  title: string;
  pageTitle: string;
  source: string = 'JV';
  sourceName: string = 'Bukti Jurnal Umum';

  constructor(
    private jurnalService: AccJurnalService,
    private tipeJurnalService: AccTipeJurnalService,
    private accReportService: AccReportService,
    private accPerusahaaanService: AccPerusahaaanService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {

    this.filterForm = this.fb.group({
      idPerusahaan: [null, []],
      tglAwal: [new Date(), []],
      tglAkhir: [new Date(), []],
      chkFilterTanggal: [true, []],
      nomor: [''],
      desc: [''],
      types: this.fb.array([]),
    });

    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe((params) => {
      if (params !== undefined && params !== null) {
        if (params.ip !== null && params.ip !== undefined) {
          this.filterForm.get('idPerusahaan').setValue(params.ip === ''? null: new Date(params.ip));
        }
        if (params.tg1 !== null && params.tg1 !== undefined) {
          this.filterForm.get('tglAwal').setValue(params.tg1 === ''? new Date(): new Date(params.tg1));
        }
        if (params.tg2 !== null && params.tg2 !== undefined) {
          this.filterForm.get('tglAkhir').setValue(params.tg2 === ''? new Date(): new Date(params.tg2));
        }
        // this.filterForm.get('chkFilterTanggal').setValue(params.tg1 === '' && params.tg2 === '')
        if (params.nomor !== null && params.nomor !== undefined) {
          this.filterForm.get('nomor').setValue(params.nomor);
        }
        if (params.desc !== null && params.desc !== undefined) {
          this.filterForm.get('desc').setValue(params.desc);
        }
        this.page = params.pagingParams.page;
        this.title = params.title;
        this.pageTitle = params.pageTitle;
        this.source = params.source;
        this.sourceName = params.sourceName;
        if(params.types !== "" && params.types !== undefined) {
          this.filterTypes = params.types.split(",")
        }
        this.previousPage = params.pagingParams.page;
        this.reverse = params.pagingParams.ascending;
        this.predicate = params.pagingParams.predicate;
      }

    });
  }

  ngOnInit(): void {
    this.accPerusahaaanService.findAll().subscribe((res) => {
      this.listPerusahaan = res
    })

    if(this.source === "JV") {
      this.tipeJurnalService.findAll().subscribe((res) => {
        const types = this.filterForm.get('types') as FormArray;
        res.forEach(e => {
          types.push(
            this.fb.group({
              id: e.id,
              name: e.name,
              description: e.description,
              selected: true,
            })
          )
        })
      });
    }
    setTimeout(()=> {this.transition()}, 500)
  }

  transition() {
    if(this.source === "JV") {
      this.filterForm.value.types.filter(e => e.selected).forEach(e => { this.filterTypes.push(e.id)})
    } else {
      this.filterTypes.push(this.source)
    }
    let url = ''
    switch (this.source ){
      case "PMT":
        url = '/daftar/pembayaran'
        break
      case "DPT":
        url = '/daftar/penerimaan'
        break
      default:
        url = '/daftar/bukti-jurnal'
    }

    this.router.navigate([url], {
      queryParams: {
        ip: this.filterForm.value.ip === undefined ? '': this.filterForm.value.ip,
        tg1: this.filterForm.value.chkFilterTanggal? moment(this.filterForm.value.tglAwal).format('YYYY-MM-DD'): '',
        tg2: this.filterForm.value.chkFilterTanggal? moment(this.filterForm.value.tglAkhir).format('YYYY-MM-DD'): '',
        nomor:
          this.filterForm.value.nomor === undefined
            ? ''
            : this.filterForm.value.nomor,
        desc:
          this.filterForm.value.desc === undefined
            ? ''
            : this.filterForm.value.desc,
        page: this.page,
        size: this.itemsPerPage,
        source: this.source,
        types: this.filterTypes.toString(),
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
    this.jurnalService
      .query({
        ip: this.filterForm.value.idPerusahaan == null? '': this.filterForm.value.idPerusahaan,
        tg1: this.filterForm.value.chkFilterTanggal? moment(this.filterForm.value.tglAwal).format('YYYY-MM-DD'): '',
        tg2: this.filterForm.value.chkFilterTanggal? moment(this.filterForm.value.tglAkhir).format('YYYY-MM-DD'): '',
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        source: this.source,
        types: this.filterTypes.toString(),
        nomor:
          this.filterForm.value.nomor === undefined
            ? ''
            : this.filterForm.value.nomor,
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

  edit(data) {
    switch(this.source) {
      case "JV":
      {
        this.router.navigate([`/akunting/aktivitas/entri-jurnal/${data.id}`], { relativeTo: this.activatedRoute });
        break;
      }
      case "DPT": {
        this.router.navigate([`/akunting/aktivitas/penerimaan/${data.id}`], { relativeTo: this.activatedRoute });
        break;
      }
      case "PMT": {
        this.router.navigate([`/akunting/aktivitas/pembayaran/${data.id}`], { relativeTo: this.activatedRoute });
        break;
      }
      default: {
        break;
      }
    }
  }

  baru() {
    switch(this.source) {
      case "JV": {
        this.router.navigate([`/akunting/aktivitas/entri-jurnal`], { relativeTo: this.activatedRoute });
        break;
      }
      case "DPT": {
        this.router.navigate([`/akunting/aktivitas/penerimaan`], { relativeTo: this.activatedRoute });
        break;
      }
      case "PMT": {
        this.router.navigate([`/akunting/aktivitas/pembayaran`], { relativeTo: this.activatedRoute });
        break;
      }
      default: {

      }
    }
  }

  delete(j: any) {
    Swal.fire({
      title: `Hapus ${this.sourceName}`,
      text: `Anda yakin untuk menghapus data '${j.nomor}' ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya Benar',
    }).then((result) => {
      if (result.value) {
        this.jurnalService.deleteById(j.id).subscribe((response) => {
          this.loadAll();
        });
      }
    });
  }

  print(d) {
    this.accReportService.getReport('journal-print', {id: d.id, type: this.source}, 'pdf')
  }

  printList() {
    this.accReportService.getReport('bk-list', {
      ip: this.filterForm.value.idPerusahaan==null? '':this.filterForm.value.idPerusahaan,
      tg1: moment(this.filterForm.value.tglAwal).format('YYYY-MM-DD'),
      tg2: moment(this.filterForm.value.tglAkhir).format('YYYY-MM-DD'),
      type: this.source
    }, 'pdf')
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'nomor') {
      result.push('nomor');
    }
    return result;
  }

  trackIdentity(index, vm: DataVM) {
    return vm.id;
  }

  get f() {
    return this.filterForm.controls;
  }
}
