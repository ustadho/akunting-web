import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { FixAssetService } from 'src/app/services/fixasset.service';

@Component({
  selector: 'app-fixasset-form-disposed',
  templateUrl: './fixasset-form-disposed.component.html',
  styleUrls: ['./fixasset-form-disposed.component.css']
})
export class FixassetFormDisposedComponent implements OnInit {
  listAkunAll: any[];
  form: any;
  readonly: boolean;
  listAkun: any[]
  isSaving = false
  listAkunGainLoss: any[]
  isSale = false
  fixAssetId = null
  fixAssetData = null
  quantityBalance = 0

  constructor(private fb: FormBuilder,
              public bsModalRef: BsModalRef,
              private service: FixAssetService,
              private toastr: ToastrService,
              private eventManager: JhiEventManager,
              ) { }

  ngOnInit(): void {
    let disposedDate = new Date()
    if(this.fixAssetData) {
      disposedDate = this.fixAssetData.lastJournalDate? this.fixAssetData.lastJournalDate: this.fixAssetData.usageDate
    }

    this.form = this.fb.group({
      id: [{ value: null, disabled: this.readonly }],
      fixAssetId: [{ value: this.fixAssetId, disabled: true }],
      disposedDate: [{ value: new Date(disposedDate), disabled: this.readonly }, [Validators.required]],
      gainLossAccountId: [{ value: null, disabled: this.readonly }, [Validators.required]],
      quantity: [{ value: this.quantityBalance, disabled: this.readonly }, [Validators.required]],
      isSale: [{ value: false, disabled: this.readonly }, [Validators.required]],
      sellingPrice: [0],
      sellingAccountId: [{ value: null, disabled: this.readonly }],
    });

    this.listAkunGainLoss = this.listAkunAll.filter(e => e.tipe==='Beban'||e.tipe==='Pendapatan Lain'||e.tipe==='Beban lain-lain'||e.tipe==='Pendapatan Lain' )
    this.enableSelling(null)
  }


  save() {
    this.validateAllFormFields(this.form);

    for (let el in this.form.controls) {
      if (
        this.form.controls[el].errors ||
        this.form.controls[el].status === 'INVALID'
      ) {
        console.log('invalid', el);
      }
    }
    this.isSaving = true;
    if (this.form.invalid) {
      // this.isSaving = false
      return;
    }
    if(this.form.value.quantity > this.quantityBalance) {
      this.toastr.error(`quantity tidak bisa lebih dari saldo (${this.quantityBalance})`)
      return
    }
    this.service.disposed(this.form.getRawValue()).subscribe(response => this.onSaveSuccess(response), (err) => this.onError(err));

  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  private onSaveSuccess(result) {
    this.toastr.success('Simpan/Update Aktiva Tetap Sukses!', 'Sukses');
    this.isSaving = false;
    this.bsModalRef.hide();
    this.eventManager.broadcast({
      name: 'saveFixassetDisposedSuccess',
      content: 'Save or Update Aktiva Tetap'
    });
  }

  private onError(error) {
    if (error !== null) {
      console.log(error);
      this.toastr.error(error.error, error.message, null);
      this.isSaving = false;
    }
  }

  enableSelling(event: any) {
    const price = this.form.get('sellingPrice');
    const account = this.form.get('sellingAccountId');

    if (this.isSale==true) {
      price.enable();
      account.enable();
    } else {
      price.disable();
      price.setValue(0);
      account.disable();
      account.setValue(null);
    }
  }

  cancel() {
    this.bsModalRef.hide();
  }

  get f() {
    return this.form.controls;
  }
}
