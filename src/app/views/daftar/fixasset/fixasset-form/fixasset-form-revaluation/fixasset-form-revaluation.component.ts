import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FADepreciationMethodService } from 'src/app/services/fa-depreciation-method.service';
import { FixAssetService } from 'src/app/services/fixasset.service';

@Component({
  selector: 'app-fixasset-form-revaluation',
  templateUrl: './fixasset-form-revaluation.component.html',
  styleUrls: ['./fixasset-form-revaluation.component.css']
})
export class FixassetFormRevaluationComponent implements OnInit {
  form: any;
  fixAssetId: string
  listAkunAll: any[]
  listAkunGainLoss: any[]
  listDepreciationMethod: any[];
  isSaving = false
  selectedDepr: any = null
  data: any;
  routeData: any;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private faDepreciationService: FADepreciationMethodService,
    private toastr: ToastrService,
    private service: FixAssetService,
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      fixAssetId: [this.fixAssetId],
      revaluationDate: [new Date(), [Validators.required]],
      lastDepreciationDate: [new Date(), [Validators.required]],
      lastBookValue: [{value:0, disabled: true}],
      amount: [0, [Validators.required, Validators.min(1)]],
      gainLossAccountId: [null, [Validators.required]],
      deprMethodId: [null, [Validators.required]],
      ratio: [0],
      newAgeYear: [0, [Validators.required, Validators.min(1)]],
      newAgeMonth: [0, [Validators.required]],
      residu: [0, [Validators.required, Validators.min(1)]],
    })

    this.listAkunGainLoss = this.listAkunAll.filter(e => e.tipe==='Pendapatan' || e.tipe==='Beban'||e.tipe==='Pendapatan Lain'||e.tipe==='Beban lain-lain'||e.tipe==='Pendapatan Lain' )
    this.faDepreciationService.findAll().subscribe(
      (res: any[]) => {
        this.listDepreciationMethod = res;
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );

    if(this.data !== null) {
      this.form.patchValue({
        id: this.data.id,
        fixAssetId: this.data.fixAssetId,
        revaluationDate: new Date(this.data.revaluationDate),
        lastDepreciationDate: new Date(this.data.lastDepreciationDate),
        lastBookValue: this.data.lastBookValue,
        amount: this.data.amount,
        gainLossAccountId: this.data.gainLossAccountId,
        deprMethodId: this.data.deprMethodId,
        ratio: this.data.ratio,
        newAgeYear: this.data.newAgeYear,
        newAgeMonth: this.data.newAgeMonth,
        residu: this.data.residu,
      })
    }

    setTimeout(() => {
      if(this.form.get('deprMethodId').value) {
        const dm = this.listDepreciationMethod.find(e=> e.id ===this.form.get('deprMethodId').value)
        this.selectDepreciationMethod(dm)
      }
    }, 1000);
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
    if(this.form.value.amount < 0) {
      this.toastr.error(`Nilai revaluasi tidak boleh Nol`)
      return
    }
    this.service.saveRevaluation(this.form.getRawValue()).subscribe(response => this.onSaveSuccess(response), (err) => this.onError(err));

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

  cancel() {
    this.bsModalRef.hide();
  }

  selectDepreciationMethod(evt) {
    this.selectedDepr = evt;
    this.calculateRate()
  }

  calculateRate() {
    let rate = 0
    if(this.selectedDepr) {
      rate = this.selectedDepr.rate / (this.form.value.newAgeYear + (this.form.value.newAgeMonth/12))
    }
    this.form.patchValue({ratio: rate})
  }

  get f() {
    return this.form.controls;
  }

  private onSaveSuccess(result) {
    this.toastr.success('Simpan/Update Aktiva Tetap Sukses!', 'Sukses');
    this.isSaving = false;
    this.bsModalRef.hide();
  }

  private onError(error) {
    if (error !== null) {
      console.log(error);
      this.toastr.error(error.error, error.message, null);
      this.isSaving = false;
    }
  }
}
