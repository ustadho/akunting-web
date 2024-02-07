import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { createRequestOption } from 'src/app/shared/util/request-util';
import { formatDate } from '@angular/common';
import { AccReportService } from '../../../services/acc-report.service';
import { AccPerusahaaanService } from '../../../services/acc-perusahaan.service';
import { AccCoaService } from '../../../services/acc-coa.service';

const REPORT_KEUANGAN = {
  NERACA_STANDAR: 11,
  NERACA_SKONTRO: 12,
  NERACA_MULTIPERIODE: 13,
  NERACA_PERBANDINGAN_BULAN: 14,
  LABA_RUGI_STANDAR: 16,
  LABA_RUGI_MULTI_PERIODE: 17,
  LABA_RUGI_PERBANDINGAN_PERIODE: 18,
}

const REPORT_GL = {
  DAFTAR_HISTORY_GL: 21,
  KESELURUHAN_JURNAL: 22,
  BUKU_BESAR_RINGKAS: 23,
  BUKU_BESAR_RINCI: 24,
  NERACA_SALDO: 25,
  NERACA_SALDO_KLASIK: 26,
  DAFTAR_AKUN: 29,
  BUKTI_JURNAL_UMUM: 30,
}

const REPORT_KASBANK = {
  DAFTAR_AKUN_KASBANK: 31,
  BUKU_BANK: 32,
}

@Component({
  selector: 'app-report-akunting',
  templateUrl: './report-akunting.component.html',
  styleUrls: ['./report-akunting.component.css']
})
export class ReportAkuntingComponent implements OnInit {
  listPilihanLaporan: any [] = []
  laporanTerpilih: any;
  subLaporanTerpilih: any;
  listPerusahaan: string[] = [];
  listAkunKasBank: any[] = []
  editForm: any;
  reportKeu = REPORT_KEUANGAN
  reportGL = REPORT_GL
  reportKB = REPORT_KASBANK

  jenisLaporan = [
    { id: 1, nama: 'Laporan Keuangan', detail: [
      {id: REPORT_KEUANGAN.NERACA_STANDAR, nama: 'Neraca (Standar)'},
      {id: REPORT_KEUANGAN.NERACA_SKONTRO, nama: 'Neraca (Induk Skontro)'},
      // {id: REPORT_KEUANGAN.NERACA_MULTIPERIODE, nama: 'Neraca (Multi Periode)'},
      // {id: REPORT_KEUANGAN.NERACA_PERBANDINGAN_BULAN, nama: 'Neraca (Perbandingan Bulan)'},
      {id: REPORT_KEUANGAN.LABA_RUGI_STANDAR, nama: 'Laba/Rugi (Standar)'},
      {id: REPORT_KEUANGAN.LABA_RUGI_MULTI_PERIODE, nama: 'Laba/Rugi (Multi Periode)'},
      {id: REPORT_KEUANGAN.LABA_RUGI_PERBANDINGAN_PERIODE, nama: 'Laba/Rugi (Perbandingan Periode)'},
    ] },
    { id: 2, nama: 'Buku Besar', detail: [
      {id: REPORT_GL.DAFTAR_HISTORY_GL, nama: 'Daftar Histori GL'},
      {id: REPORT_GL.KESELURUHAN_JURNAL, nama: 'Keseluruhan Jurnal'},
      {id: REPORT_GL.BUKU_BESAR_RINGKAS, nama: 'Ringkasan Buku Besar'},
      {id: REPORT_GL.BUKU_BESAR_RINCI, nama: 'Buku Besar - Rinci'},
      {id: REPORT_GL.NERACA_SALDO, nama: 'Neraca Saldo'},
      {id: REPORT_GL.NERACA_SALDO_KLASIK, nama: 'Neraca Saldo - Klasik'},
      {id: REPORT_GL.DAFTAR_AKUN, nama: 'Daftar Akun'},
      {id: REPORT_GL.BUKTI_JURNAL_UMUM, nama: 'Bukti Jurnal Umum'},
    ] },
    { id: 3, nama: 'Kas & Bank', detail: [
      {id: REPORT_KASBANK.DAFTAR_AKUN_KASBANK, nama: 'Daftar Akun Kas dan Bank'},
      {id: REPORT_KASBANK.BUKU_BANK, nama: 'Buku Bank'}
    ] },
    // { id: 4, nama: 'Rekap Biaya' },
    // { id: 5, nama: 'Laba Rugi' },
  ];
  constructor(
    private fb: FormBuilder,
    private reportService: AccReportService,
    private perusahaanService: AccPerusahaaanService,
    private accCoaService: AccCoaService,
    private toastr: ToastrService
  ) {
    this.laporanTerpilih = this.jenisLaporan[0];
    this.listPilihanLaporan = this.laporanTerpilih.detail

    this.editForm = this.fb.group({
      tg1: [new Date()],
      tg2: [new Date()],
      ltg1: [new Date()],
      ltg2: [new Date()],
      bl1: [new Date().toISOString().substring(5, 7)],
      bl2: [new Date().toISOString().substring(5, 7)],
      th1: [new Date().toISOString().substring(0, 4)],
      th2: [new Date().toISOString().substring(0, 4)],
      perusahaan: [null],
      accountId: [null],
      subLaporanTerpilih: [null],
      termasukSaldoNol: [false],
      tampilkanInduk: [true],
      tampilkanAnak: [true],
    });

    this.perusahaanService.findAll().subscribe(res => {
      this.listPerusahaan = res
    })
  }

  ngOnInit(): void {
    this.accCoaService.findAllTrx(0).subscribe(
      (res: HttpResponse<any[]>) => {
        this.listAkunKasBank = res.body
        this.listAkunKasBank.map((e) => {
          e.namaKode = `${e.nama} - ${e.kode}`;
        });
      },
      (res: HttpResponse<any>) => this.onError(res.body))

  }

  pilih(laporan) {
    this.laporanTerpilih = laporan;
    console.log(laporan)
    this.listPilihanLaporan = laporan.detail
  }

  onCancel() {
    window.history.back();
  }

  cetak(format) {
    console.log('this.subLaporanTerpilih', this.editForm.get('subLaporanTerpilih').value)
    switch (this.editForm.get('subLaporanTerpilih').value) {
      case REPORT_GL.DAFTAR_HISTORY_GL: {
        this.reportService.getReport('gl-history', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
        } , format)
        break;
      }
      case REPORT_GL.KESELURUHAN_JURNAL: {
        this.reportService.getReport('gl-all', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
        } , format)
        break;
      }
      case REPORT_GL.BUKU_BESAR_RINGKAS: {
        this.reportService.getReport('gl-summary', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
        } , format)
        break;
      }
      case REPORT_GL.BUKU_BESAR_RINCI: {
        this.reportService.getReport('gl-detail', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          accId: this.editForm.get("accountId").value,
          ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
        } , format)
        break;
      }
      case REPORT_GL.NERACA_SALDO: {
        this.reportService.getReport('gl-neraca-saldo', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          termasukSaldoNol: this.editForm.get('termasukSaldoNol').value,
          ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
        } , format)
        break;
      }
      case REPORT_GL.NERACA_SALDO_KLASIK: {
        this.reportService.getReport('gl-neraca-saldo-klasik', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          termasukSaldoNol: this.editForm.get('termasukSaldoNol').value,
          ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
        } , format)
        break;
      }
      case REPORT_GL.DAFTAR_AKUN: {
        this.reportService.getReport('gl-akun-list', {
          per: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
        } , format)
        break;
      }
      case REPORT_GL.BUKTI_JURNAL_UMUM: {
        this.reportService.getReport('gl-bukti-jurnal', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
        } , format)
        break;
      }
      case REPORT_KEUANGAN.NERACA_STANDAR:{
        this.reportService.getReport('keu-neraca-standar', {
          per: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
          showParent: this.editForm.get('tampilkanInduk').value,
          showChildren: this.editForm.get('tampilkanAnak').value,
          termasukSaldoNol: this.editForm.get('termasukSaldoNol').value,
        } , format)
        break;
      }
      case REPORT_KEUANGAN.NERACA_SKONTRO:{
        this.reportService.getReport('keu-neraca-skontro', {
          per: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
          showParent: this.editForm.get('tampilkanInduk').value,
          showChildren: this.editForm.get('tampilkanAnak').value,
          termasukSaldoNol: this.editForm.get('termasukSaldoNol').value,
        } , format)
        break;
      }
      case REPORT_KEUANGAN.NERACA_MULTIPERIODE:
      case REPORT_KEUANGAN.NERACA_PERBANDINGAN_BULAN:
        this.showToastrReportBelumTersedia()
        break;
      case REPORT_KEUANGAN.LABA_RUGI_STANDAR:
        this.reportService.getReport('keu-lr-standar', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
          showParent: this.editForm.get('tampilkanInduk').value,
          showChildren: this.editForm.get('tampilkanAnak').value,
          termasukSaldoNol: this.editForm.get('termasukSaldoNol').value,
        } , format)
        break;
      case REPORT_KEUANGAN.LABA_RUGI_MULTI_PERIODE:
        this.reportService.getReport('keu-lr-multiperiode', {
          tg1: this.editForm.value.th1+"-"+this.editForm.value.bl1+"-01",
          tg2: this.editForm.value.th2+"-"+this.editForm.value.bl2+"-01",
          ip: this.editForm.get('perusahaan').value ? this.editForm.get('perusahaan').value: '',
          showParent: this.editForm.get('tampilkanInduk').value,
          showChildren: this.editForm.get('tampilkanAnak').value,
          termasukSaldoNol: this.editForm.get('termasukSaldoNol').value,
        } , format)
        break;
      case REPORT_KEUANGAN.LABA_RUGI_PERBANDINGAN_PERIODE:
          this.reportService.getReport('keu-lr-compare', {
            ptg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
            ptg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
            ltg1: formatDate(this.editForm.get('ltg1').value, 'yyyy-MM-dd', 'en_US'),
            ltg2: formatDate(this.editForm.get('ltg2').value, 'yyyy-MM-dd', 'en_US'),
            ip: this.editForm.get('perusahaan').value ? this.editForm.get('perusahaan').value: '',
            showParent: this.editForm.get('tampilkanInduk').value,
            showChildren: this.editForm.get('tampilkanAnak').value,
            termasukSaldoNol: this.editForm.get('termasukSaldoNol').value,
          } , format)
          break;
      case REPORT_KASBANK.DAFTAR_AKUN_KASBANK:
          this.reportService.getReport('kb-akun-list', {
            per: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
            ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
          } , format)
          break;
      case REPORT_KASBANK.BUKU_BANK:
            this.reportService.getReport('kb-buku-bank', {
              tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
              ip: this.editForm.get('perusahaan').value? this.editForm.get('perusahaan').value: '',
            } , format)
            break;
      default: {
        break;
      }
    }
  }

  showToastrReportBelumTersedia() {
     this.toastr.info("Maaf report belum tersedia!")
  }


  private onError(error) {
    this.toastr.error(error.error, error.message, null);
  }
}
