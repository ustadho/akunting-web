import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ReportFixassetService } from '../../../services/report-fixasset.service';
import { formatDate } from '@angular/common';

const REPORT_FA = {
  TIPE_AKTIVA_TETAP_PAJAK: 1,
  DAFTAR_AKTIVA_PER_AKTIVA_TETAP: 2,
  DAFTAR_AKTIVA_PER_AKTIVA_PAJAK: 3,
  DETAIL_JURNAL: 4,
}

@Component({
  selector: 'app-report-fixasset',
  templateUrl: './report-fixasset.component.html',
  styleUrls: ['./report-fixasset.component.css']
})
export class ReportFixassetComponent implements OnInit {

  report = REPORT_FA
  laporanTerpilih: any = null;
  listPerusahaan: string[] = [];
  listVendor: string[] = [];
  editForm: any;

  jenisLaporan = [
    { id: this.report.TIPE_AKTIVA_TETAP_PAJAK, nama: 'Tipe Aktiva Tetap Pajak'},
    { id: this.report.DAFTAR_AKTIVA_PER_AKTIVA_TETAP, nama: 'Daftar Aktiva Tetap per Tipe Aktiva Tetap'},
    { id: this.report.DAFTAR_AKTIVA_PER_AKTIVA_PAJAK, nama: 'Daftar Aktiva Tetap per Tipe Aktiva Pajak'},
    { id: this.report.DETAIL_JURNAL, nama: 'Rincian Jurnal Aktiva Tetap'},


  ]
  constructor(
    private fb: FormBuilder,
    private reportService: ReportFixassetService,
    ) { }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      tg1: [new Date()],
      tg2: [new Date()],
    });

    this.laporanTerpilih = this.jenisLaporan[0]
  }

  cetak(format) {
    switch (this.laporanTerpilih.id) {
      case REPORT_FA.TIPE_AKTIVA_TETAP_PAJAK: {
        this.reportService.getReport('fiscal-type', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
        } , format)
        break;
      }
      case REPORT_FA.DAFTAR_AKTIVA_PER_AKTIVA_TETAP: {
        this.reportService.getReport('list-per-type', {
          per: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
        } , format)
        break;
      }
      case REPORT_FA.DAFTAR_AKTIVA_PER_AKTIVA_PAJAK: {
        this.reportService.getReport('list-per-fiscal', {
          per: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
        } , format)
        break;
      }
      case REPORT_FA.DETAIL_JURNAL: {
        this.reportService.getReport('fa-det-journal', {
          tg1: formatDate(this.editForm.get('tg1').value, 'yyyy-MM-dd', 'en_US'),
          tg2: formatDate(this.editForm.get('tg2').value, 'yyyy-MM-dd', 'en_US'),
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

  get startDateLabel() {
    return [REPORT_FA.DAFTAR_AKTIVA_PER_AKTIVA_PAJAK, REPORT_FA.DAFTAR_AKTIVA_PER_AKTIVA_TETAP].includes(this.laporanTerpilih.id) ? "Per": "Dari"
  }

  get isHiddenStartDate() {
    return [REPORT_FA.TIPE_AKTIVA_TETAP_PAJAK].includes(this.laporanTerpilih.id)
  }

  get isHiddenEndDate() {
    return [REPORT_FA.TIPE_AKTIVA_TETAP_PAJAK, REPORT_FA.DAFTAR_AKTIVA_PER_AKTIVA_PAJAK, REPORT_FA.DAFTAR_AKTIVA_PER_AKTIVA_TETAP].includes(this.laporanTerpilih.id)
  }
}
