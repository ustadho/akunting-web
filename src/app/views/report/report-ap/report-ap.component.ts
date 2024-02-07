import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ReportAPService } from '../../../services/report-ap.service';
import { formatDate } from '@angular/common';
import { AccPerusahaaanService } from '../../../services/acc-perusahaan.service';
import { AccVendorService } from '../../../services/acc-vendor.service';

const REPORT_AP = {
  PEMBELIAN_PER_PEMASOK: 1,
  PEMBELIAN_PER_PEMASOK_DETAIL: 2,
  PEMBELIAN_PER_BARANG_TOTAL: 3,
  PEMBELIAN_PER_BARANG_QTY: 4,
  PEMBELIAN_PER_BARANG: 5,
  PEMBELIAN_PER_BARANG_DET: 6,
  PEMBELIAN_PER_PEMASOK_BARANG: 7,
  PEMBELIAN_PER_BARANG_PEMASOK: 8,
  PEMBELIAN_PER_BIAYA: 9,
}

@Component({
  selector: 'app-report-ap',
  templateUrl: './report-ap.component.html',
  styleUrls: ['./report-ap.component.css']
})

export class ReportApComponent implements OnInit {
  reportAP = REPORT_AP
  laporanTerpilih: any = null;
  listPerusahaan: string[] = [];
  listVendor: string[] = [];
  editForm: any;

  jenisLaporan = [
    { id: this.reportAP.PEMBELIAN_PER_PEMASOK, nama: 'Pembelian Per Pemasok'},
    { id: this.reportAP.PEMBELIAN_PER_PEMASOK_DETAIL, nama: 'Rincian Pembelian Per Pemasok'},
    { id: this.reportAP.PEMBELIAN_PER_BARANG_TOTAL, nama: 'Pembelian Per Barang (Total)'},
    { id: this.reportAP.PEMBELIAN_PER_BARANG_QTY, nama: 'Pembelian Per Barang (Kuantitas)'},
    { id: this.reportAP.PEMBELIAN_PER_BARANG, nama: 'Pembelian Per Barang'},
    { id: this.reportAP.PEMBELIAN_PER_BARANG_DET, nama: 'Rincian Pembelian Per Barang'},
    { id: this.reportAP.PEMBELIAN_PER_PEMASOK_BARANG, nama: 'Pembelian Pemasok Per Barang'},
    { id: this.reportAP.PEMBELIAN_PER_BARANG_PEMASOK, nama: 'Pembelian Barang Per Pemasok'},
    { id: this.reportAP.PEMBELIAN_PER_BIAYA, nama: 'Pembelian Per Biaya'},

  ]
  constructor(
    private fb: FormBuilder,
    private reportService: ReportAPService,
    private perusahaanService: AccPerusahaaanService,
    private vendorService: AccVendorService,
    ) { }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      tg1: [new Date()],
      tg2: [new Date()],
      perusahaan: [null],
      vendor: [null],
      interval: [""],
    });
    this.perusahaanService.findAll().subscribe(res => {
      this.listPerusahaan = res
    })
    this.vendorService.findAll().subscribe(res => {
      this.listVendor = res
    })
    this.laporanTerpilih = this.jenisLaporan[0]
  }

  cetak(format) {
    switch (this.laporanTerpilih.id) {
      case REPORT_AP.PEMBELIAN_PER_PEMASOK: {
        this.reportService.getReport('purchase-by-vendor-sum', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value?? '',
          vid: this.editForm.get('vendor').value?? '',
          interval: this.editForm.get('interval').value,
        } , format)
        break;
      }
      case REPORT_AP.PEMBELIAN_PER_PEMASOK_DETAIL: {
        this.reportService.getReport('purchase-by-vendor-det', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value?? '',
          vid: this.editForm.get('vendor').value?? '',
          interval: this.editForm.get('interval').value,
        } , format)
        break;
      }
      case REPORT_AP.PEMBELIAN_PER_BARANG_TOTAL: {
        this.reportService.getReport('purchase-by-item-amt', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value?? '',
          vid: this.editForm.get('vendor').value?? '',
          interval: this.editForm.get('interval').value,
        } , format)
        break;
      }
      case REPORT_AP.PEMBELIAN_PER_BARANG_QTY: {
        this.reportService.getReport('purchase-by-item-qty', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value?? '',
          vid: this.editForm.get('vendor').value?? '',
          interval: this.editForm.get('interval').value,
        } , format)
        break;
      }
      case REPORT_AP.PEMBELIAN_PER_BARANG: {
        this.reportService.getReport('purchase-by-item', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value?? '',
          vid: this.editForm.get('vendor').value?? '',
        } , format)
        break;
      }
      case REPORT_AP.PEMBELIAN_PER_BARANG_DET: {
        this.reportService.getReport('purchase-by-item-det', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value?? '',
          vid: this.editForm.get('vendor').value?? '',
        } , format)
        break;
      }
      case REPORT_AP.PEMBELIAN_PER_PEMASOK_BARANG: {
        this.reportService.getReport('purchase-by-vendor-item', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value?? '',
        } , format)
        break;
      }
      case REPORT_AP.PEMBELIAN_PER_BARANG_PEMASOK: {
        this.reportService.getReport('purchase-by-item-vendor', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value?? '',
        } , format)
        break;
      }
      case REPORT_AP.PEMBELIAN_PER_BIAYA: {
        this.reportService.getReport('purchase-by-expense-det', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
          ip: this.editForm.get('perusahaan').value?? '',
          vid: this.editForm.get('vendor').value?? '',
        } , format)
        break;
      }
      default: {
        break
      }
    }
  }

  selectReport(laporan) {
    this.laporanTerpilih = laporan;
  }

  onCancel(){

  }
}
