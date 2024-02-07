import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccPerusahaaanService } from '../../../services/acc-perusahaan.service';
import { AccJurnalService } from '../../../services/acc-jurnal.service';
import { ToastrService } from 'ngx-toastr';
import { AccCoaService } from '../../../services/acc-coa.service';
import { TIPE_AKUN } from 'src/app/shared/constants/accounting.constants';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BuktiKasBank } from '../../../models/jurnal.model';
import { Location } from '@angular/common';
import { DATE_FORMAT } from 'src/app/shared/constants/input.constants';
import * as moment from 'moment';
import { AccReportService } from '../../../services/acc-report.service';
import { LookupAkunComponent } from 'src/app/components/modals/lookup-akun/lookup-akun.component';
@Component({
  selector: 'app-bukti-kas',
  templateUrl: './bukti-kas.component.html',
  styleUrls: ['./bukti-kas.component.css']
})
export class BuktiKasComponent implements OnInit {
  @ViewChildren('detAmount') detAmounts:  QueryList<ElementRef>;
  editMode = false;
  form: FormGroup;
  bsModalRef: BsModalRef;
  total = 0;
  isSaving = false;
  isSameTotal = false;
  isMultiCurrency = false;
  id = null;
  listPerusahaan = []
  listAkunKasBank = []
  routeData: any;
  tipe = ""
  selectedKasBank = null

  constructor(
    private accPerusahaaanService: AccPerusahaaanService,
    private accJurnalService: AccJurnalService,
    private fb: FormBuilder,
    private bsModalService: BsModalService,
    private toastrService: ToastrService,
    private accCoaService: AccCoaService,
    private accReportService: AccReportService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.createForm();
    setTimeout(()=> this.form.get("idPerusahaan").setValue(1), 300)
    this.findAllPerusahaan()
    this.accCoaService.findAllTrx(TIPE_AKUN.KAS_BANK).subscribe(
      (res: HttpResponse<any[]>) => {
        this.listAkunKasBank = res.body
      },
      (res: HttpResponse<any>) => this.onError(res.body))

    this.routeData = this.activatedRoute.data.subscribe(({tipe, data}) => {
      this.tipe = tipe
      setTimeout(() => {
        if (data) {
          this.updateForm(data);
        } else {
          this.form.patchValue({tipe: this.tipe})
          this.tambahItem()
        }
      }, 500);
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [null],
      tanggal: [new Date(), [Validators.required]],
      nomor: [null, [Validators.required]],
      idPerusahaan: [1, [Validators.required]],
      idAkunKasBank: [null, [Validators.required]],
      kodeAkunKasBank: [null, [Validators.required]],
      namaAkunKasBank: [null],
      voidCheque: [false],
      nomorCek: [null],
      tipe: [this.tipe],
      keterangan: [null],
      payee: "",
      amount: [0, [Validators.required]],
      detId: [null],
      detail: this.fb.array([]),
    })

    this.total = 0

  }

  updateForm(data: BuktiKasBank): void {
    this.id = data.id
    this.form.patchValue({
      id: data.id,
      tipe: data.tipe,
      idPerusahaan: data.idPerusahaan,
      idAkunKasBank: data.idAkunKasBank,
      kodeAkunKasBank: data.kodeAkunKasBank,
      tanggal: new Date(data.tanggal),
      nomor: data.nomor,
      chequeNo: data.chequeNo,
      voidCheque: data.voidCheque,
      keterangan: data.keterangan,
      payee: data.payee,
      amount: data.amount,
      detId: data.detId,
      detail: [],
    });
    const details = this.form.get('detail') as FormArray;
    data.detail.forEach(e => {
      details.push(
        this.fb.group({
          id: e.id,
          idAkun: e.idAkun,
          kodeAkun: e.kodeAkun,
          namaAkun: e.namaAkun,
          amount: e.amount,
          memo: e.memo,
          seq: e.seq,
        })
      )
    })
    this.hitungTotal()
  }

  adjustAmount() {
    this.form.get("amount").setValue(this.total)
  }

  selectAkunKasBank(d) {
    console.log(d)
    if(d && d.kode) {
      this.selectedKasBank = d
      this.form.get("kodeAkunKasBank").setValue(d.kode)
      this.getNomorBuktiAuto()
    }
  }

  move(shift, currentIndex) {
    const details = this.form.get('detail') as FormArray;
    let newIndex: number = currentIndex + shift;
    if (newIndex === -1) {
      newIndex = details.length - 1;
    } else if (newIndex == details.length) {
      newIndex = 0;
    }

    const currentRow = details.at(currentIndex);
    const currentSeq = currentRow.get('seq').value;
    currentRow.get('seq').setValue(currentIndex + shift + 1);

    const newRow = details.at(newIndex);
    newRow.get('seq').setValue(currentSeq);

    details.removeAt(currentIndex);
    details.insert(newIndex, currentRow);
  }

  get getFormDetailControls() {
    const control = this.form.get('detail') as FormArray;
    return control;
  }

  get f() {
    return this.form.controls;
  }

  getNomorBuktiAuto() {
    this.accJurnalService.getNoBuktiKas(this.selectedKasBank.id, this.tipe, moment(this.form.get('tanggal').value).format(DATE_FORMAT))
    .subscribe((res: any) => {
      this.form.get('nomor').setValue(res.nomor)
    })
  }

  findAllPerusahaan() {
    this.accPerusahaaanService.findAll().subscribe((res) => {
      this.listPerusahaan = res
    })
  }

  openLookupAkun(idx) {
    const initialState = {
      data: null,
      readonly: false,
      title: 'Pilih Data Akun'
    };
    this.bsModalRef = this.bsModalService.show(LookupAkunComponent, { initialState });
    this.bsModalRef.setClass('modal-lg');
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((x) => {
      let detail = this.form.get('detail') as FormArray;
      detail.at(idx).patchValue({
        idAkun: x.id,
        kodeAkun: x.kode,
        namaAkun: x.nama,
        seq: detail.length,
      })
    })

    // this.detAmounts.changes.pipe(take(1)).subscribe({
    //   next: changes => changes.last.nativeElement.focus()
    // });
  }

  hitungTotal() {
    const detail = this.form.get('detail') as FormArray;
    this.total = 0
    detail.controls.map((x) => {
      this.total += parseFloat(x.value.amount)
    })
  }

  searchAkun(row) {
    const detail = this.form.get('detail') as FormArray
    const kode = detail.at(detail.length - 1).get('kodeAkun').value
    if (kode == null || kode == '') {
      this.openLookupAkun(row)
    } else {
      this.accCoaService.findByKode(kode).subscribe(res => {
        const detail = this.form.get('detail') as FormArray;
        detail.at(row).get('idAkun').setValue(res.body.id);
        detail.at(row).get('kodeAkun').setValue(res.body.kode);
        detail.at(row).get('namaAkun').setValue(res.body.nama);
      });
    }
  }

  tambahItem() {
    const detail = this.form.get('detail') as FormArray;
    if (detail.length > 0 && detail.at(detail.length - 1).get('idAkun').value == null) {
      return
    }

    detail.push(
      this.fb.group({
        "akunKb": true,
        "id": null,
        "idAkun": [null, [Validators.required]],
        "kodeAkun": [null, [Validators.required]],
        "namaAkun": [null, [Validators.required]],
        "memo": "",
        "amount": 0,
        "seq": detail.length + 1
      })
    );
    if(detail.length > 1) {
      this.openLookupAkun(detail.length-1)
    }
  }

  onHapusItem(index) {
    swal
      .fire({
        title: 'Hapus Item',
        text: `Anda yakin untuk menghapus item ini?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya Benar',
      })
      .then((result) => {
        if (result.value) {
          let detail = this.form.get('detail') as FormArray;
          detail.removeAt(index);

          for (const control of detail.controls) {
            control
              .get('urut')
              .setValue(detail.controls.indexOf(control) + 1);
          }
        }
      });
  }

  batal() {
    if(this.form.value.detail.length ==0) {
      window.history.back();
      return;
    }
    swal
      .fire({
        title: 'Batal Entri Jurnal',
        text: `Anda yakin untuk membatalkan Entri Jurnal ini?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya Benar',
      })
      .then((result) => {
        if (result.value) {
          this.createForm()
          this.isSaving = false;
          this.isSameTotal = false
        }
      });
  }

  save() {
    this.isSaving = true;
    this.isSameTotal = this.total === Number(this.form.get("amount").value);
    if (!this.form.valid || !this.isSameTotal) return

    const data = this.form.value;
    this.accJurnalService.saveBuktiKas(data).subscribe(
      (result) => {
        this.onSaveSuccess(result);
      },
      (err) => this.onError(err)
    );

  }

  print() {
    this.accReportService.getReport('journal-print', {id: this.id, type: this.tipe}, 'pdf')
  }

  private onSaveSuccess(result) {
    this.toastrService.success('Simpan/Update Biaya Sukses!', 'Sukses');
    this.isSaving = false;
    this.isSameTotal = false

    if (typeof this.id != 'undefined' && this.id !== null) {
      this.location.back();
    } else {
      setTimeout(() => {
        this.createForm()
        this.tambahItem()
      }, 200)
    }
  }
  private onError(error) {
    this.isSaving = false;
    this.isSameTotal = false
    this.toastrService.error(error.title, error.message, null);
  }

  emptyLatestRow() {
    let detail = this.form.get('detail') as FormArray;
    return detail && detail.length > 0 && detail?.at(detail.length-1)?.get("idAkun").value == null
  }

}
