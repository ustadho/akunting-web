import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AccReportService } from 'src/app/services/acc-report.service';
import { AccPerusahaaanService } from 'src/app/services/acc-perusahaan.service';
import { AccJurnalService } from 'src/app/services/acc-jurnal.service';
import { AccCoaService } from 'src/app/services/acc-coa.service';
import { JurnalEntry } from '../../../models/jurnal.model';
import { LookupAkunComponent } from 'src/app/components/modals/lookup-akun/lookup-akun.component';

@Component({
  selector: 'app-entri-jurnal',
  templateUrl: './entri-jurnal.component.html'
})
export class EntriJurnalComponent implements OnInit {
  routeData: any;
  editMode = false;
  form: FormGroup;
  bsModalRef: BsModalRef;
  total = {
    debet: 0,
    kredit: 0
  };
  isSaving = false;
  isDebetKreditNotSame = false;
  isMultiCurrency = false;
  id = null;
  listPerusahaan = []
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
    console.log('initJurnal')
    this.createForm()
    this.findAllPerusahaan()
    setTimeout(()=> this.form.get('idPerusahaan').setValue(1), 300)

    this.routeData = this.activatedRoute.data.subscribe(({data}) => {
      setTimeout(() => {
        if (data) {
          this.updateForm(data);
        } else {
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
      idTipe: [1],
      keterangan: [null],
      detail: this.fb.array([]),
    })

    this.total.debet = 0
    this.total.kredit = 0
    // this.tambahItem()
  }

  updateForm(data: JurnalEntry): void {
    this.id = data.id
    this.form.patchValue({
      id: data.id,
      idPerusahaan: data.idPerusahaan,
      tanggal: new Date(data.tanggal),
      nomor: data.nomor,
      keterangan: data.keterangan,
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
          debet: e.debet,
          kredit: e.kredit,
          keterangan: e.keterangan,
          rate: e.rate,
          primeAmount: e.primeAmount,
          seq: e.seq,
        })
      )
    })
    this.hitungTotal()
  }

  onBlurDK(dk, index) {
    const details = this.form.get('detail') as FormArray;
    const dVal = details.at(index).get('debet').value
    const kVal = details.at(index).get('kredit').value

    if (dk == 'D' && dVal > 0 && kVal > 0) {
      details.at(index).get('kredit').setValue(0)
    } else if(dk == 'K' && kVal > 0 && dVal > 0) {
      details.at(index).get('debet').setValue(0)
    }
  }

  move(shift, currentIndex) {
    console.log('currentIndex', currentIndex)
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
        namaAkun: x.nama
      })

      // auto set value debet kredit
      if (parseInt(detail.at(idx).value.debet) === 0
        && parseInt(detail.at(idx).value.kredit) === 0
        && detail.length > 1) {
        let debet = 0, kredit = 0;
        detail.controls.map((x) => {
          debet += parseFloat(x.value.debet)
          kredit += parseFloat(x.value.kredit)
        })
        let selisih = debet - kredit;
        if (selisih > 0) {
          detail.at(idx).get('kredit').setValue(selisih, { emitEvent: false });
          detail.at(idx).get('kredit').markAsTouched();

          // detail.at(idx).get('kredit').updateValueAndValidity({ emitEvent: true });
        } else {
          detail.at(idx).get('debet').setValue(selisih * -1, { emitEvent: false });
          detail.at(idx).get('debet').markAsTouched();
        }
        this.hitungTotal()
      }

    })
  }

  hitungTotal() {
    const detail = this.form.get('detail') as FormArray;
    this.total = {
      debet: 0,
      kredit: 0
    }
    detail.controls.map((x) => {
      this.total.debet += parseFloat(x.value.debet)
      this.total.kredit += parseFloat(x.value.kredit)
    })

    if (this.total.debet !== this.total.kredit) {
      this.isDebetKreditNotSame = true;
    } else {
      this.isDebetKreditNotSame = false
    }
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
        // (<any>detail.at(row).get('debet')).nativeElement.focus();
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
        "idAkun": null,
        "kodeAkun": [null, [Validators.required]],
        "namaAkun": [null, [Validators.required]],
        "idKapalBerangkat": null,
        "keterangan": "",
        "debet": 0,
        "kredit": 0,
        "primeAmount": 0,
        "rate": 1,
        "subsidaryLedger": "",
        "seq": detail.length
      }, { validators: this.validatorDebetOrKreditRequired })
    );
    if(detail.length > 1) {
      this.openLookupAkun(detail.length-1)
    }
  }

  validatorDebetOrKreditRequired(group: FormGroup) {
    let debet = group.controls.debet.value;
    let kredit = group.controls.kredit.value;

    return (parseFloat(debet) !== 0 || parseFloat(kredit) !== 0) ? null : { debetKreditRequired: true };
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
        }
      });
  }

  batal() {
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
          this.isDebetKreditNotSame = false
        }
      });
  }

  save() {
    this.isSaving = true;

    if (this.total.debet !== this.total.kredit) this.isDebetKreditNotSame = true;

    if (this.form.invalid || this.isDebetKreditNotSame) return

    const data = this.form.value;

    this.accJurnalService.saveJurnal(data).subscribe(
      (result) => {
        this.onSaveSuccess(result);
      },
      (err) => this.onError(err)
    );

  }

  print() {
    this.accReportService.getReport('journal-print', {id: this.id, type: "JV"}, 'pdf')
  }

  private onSaveSuccess(result) {
    this.toastrService.success('Simpan/Update Biaya Sukses!', 'Sukses');
    this.isSaving = false;
    this.isDebetKreditNotSame = false

    if (typeof this.id != 'undefined' && this.id !== null) {
      this.location.back();
    } else {
      setTimeout(() => {
        this.createForm()
      }, 200)
    }
  }
  private onError(err) {
    this.isSaving = false;
    this.isDebetKreditNotSame = false
    if (err.error !== null) {
      this.toastrService.error('Errror!', err.error.title);
    }
    this.isSaving = false;
  }

  emptyLatestRow() {
    let detail = this.form.get('detail') as FormArray;
    return detail && detail.length > 0 && detail?.at(detail.length-1)?.get("idAkun").value == null
  }

}
