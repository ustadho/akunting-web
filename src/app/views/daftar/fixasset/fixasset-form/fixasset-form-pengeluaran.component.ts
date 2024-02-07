import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import { AccCoaService } from '../../../../services/acc-coa.service';
import { LookupAkunComponent } from 'src/app/components/modals/lookup-akun/lookup-akun.component';

@Component({
  selector: 'app-fixasset-form-pengeluaran',
  templateUrl: './fixasset-form-pengeluaran.component.html',
})
export class FixAssetFormPengeluaranComponent implements OnInit {
  @Input() formGroupName!: string;
  form!: FormGroup;
  @Input() isSaving: boolean;

  isSameTotal = false;
  bsModalRef: BsModalRef;

  constructor(
    private rootFormGroup: FormGroupDirective,
    private fb: FormBuilder,
    private bsModalService: BsModalService,
    private accCoaService: AccCoaService
  ) {}

  ngOnInit(): void {
    // this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.form = this.rootFormGroup.control as FormGroup;
  }

  calculateDetail() {
    let totCost = 0;
    const detail = this.form.get('detail') as FormArray;
    detail.controls.map((x) => {
      totCost += parseFloat(x.value.amount);
    });
    this.form.get("cost").setValue(totCost)
    this.form.get("amountOfAccountingValue").setValue(totCost)
  }

  openLookupAkun(idx) {
    const details = this.form.get('detail') as FormArray;
    const initialState = {
      data: null,
      readonly: false,
      title: 'Pilih Data Akun',
    };
    this.bsModalRef = this.bsModalService.show(LookupAkunComponent, {
      initialState,
    });
    this.bsModalRef.setClass('modal-lg');
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((x) => {
      details.at(idx).patchValue({
        akunId: x.id,
        akunCode: x.kode,
        description: x.nama,
        expDate: new Date(),
        amount: 0,
        seq: details.length,
      });
    });

    // this.detAmounts.changes.pipe(take(1)).subscribe({
    //   next: changes => changes.last.nativeElement.focus()
    // });
  }

  searchAkun(row) {
    const details = this.form.get('detail') as FormArray;
    const kode = details.at(details.length - 1).get('akunCode').value;
    if (kode == null || kode == '') {
      this.openLookupAkun(row);
    } else {
      this.accCoaService.findByKode(kode).subscribe((res) => {
        details.at(row).get('akunId').setValue(res.body.id);
        details.at(row).get('akunCode').setValue(res.body.kode);
      });
    }
  }

  tambahItem() {
    const details = this.form.get('detail') as FormArray;
    if (
      details.length > 0 &&
      details.at(details.length - 1).get('akunId').value == null
    ) {
      return;
    }

    details.push(
      this.fb.group({
        id: null,
        akunId: [null, [Validators.required]],
        akunCode: [null, [Validators.required]],
        description: [null, [Validators.required]],
        expDate: [new Date(), [Validators.required]],
        amount: [0, [Validators.required, Validators.min(1)]],
        seq: details.length + 1,
      })
    );
    if (details.length > 0) {
      this.openLookupAkun(details.length - 1);
    }
  }

  get disabledAddItem() {
    return this.form.value.vendorId === null || this.form.value.formNo === null || this.form.value.formNo === '' || this.form.value.invoiceNo === null || this.form.value.invoiceNo === ''
  }

  onHapusItem(index) {
    const details = this.form.get('detail') as FormArray;
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
          details.removeAt(index);

          for (const control of details.controls) {
            control.get('seq').setValue(details.controls.indexOf(control) + 1);
          }
        }
      });
  }

  onMove(shift, currentIndex) {
    const details = this.form.get('detail') as FormArray;
    let newIndex: number = currentIndex + shift;
    if (newIndex === -1) {
      newIndex = details.length - 1;
    } else if (newIndex == details.length) {
      newIndex = 0;
    }

    const currentRow = details.at(currentIndex);
    const currentUrut = currentRow.get('urut').value;
    currentRow.get('urut').setValue(currentIndex + shift + 1);

    const newRow = details.at(newIndex);
    newRow.get('urut').setValue(currentUrut);

    details.removeAt(currentIndex);
    details.insert(newIndex, currentRow);
  }

  emptyLatestRow() {
    const details = this.form.get('detail') as FormArray;
    return (
      details &&
      details.length > 0 &&
      Boolean(details?.at(details.length - 1)) &&
      details?.at(details.length - 1).get('akunId').value == null
    );
  }

  get getFormDetailControls() {
    const control = this.form.get('detail') as FormArray;
    return control;
  }
}
