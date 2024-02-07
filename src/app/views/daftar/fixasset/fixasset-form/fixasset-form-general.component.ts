import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { FADepreciationMethodService } from '../../../../services/fa-depreciation-method.service';
import { HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AccCoaService } from '../../../../services/acc-coa.service';

@Component({
  selector: 'app-fixasset-form-general',
  templateUrl: './fixasset-form-general.component.html',
})
export class FixassetFormGeneralComponent implements OnInit {
  form!: FormGroup;
  @Input() isSaving: boolean;
  @Input() listAkunAll: any[];
  listDepreciationMethod: any[];
  listAkunAktiva: any[] = []
  listAkunAkumPenyusutan: any[] = []
  listAkunBebanPenyusutan: any[] = []
  selectedDepr: any = null

  constructor(
    private rootFormGroup: FormGroupDirective,
    private faDepreciationService: FADepreciationMethodService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup.control as FormGroup;
    this.faDepreciationService.findAll().subscribe(
      (res: any[]) => {
        this.listDepreciationMethod = res;
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );
    setTimeout(()=> {
      if(this.listAkunAll !== null) {
        this.listAkunAktiva = this.listAkunAll.filter(a => a.tipe==='Aktiva Tetap')
        this.listAkunAkumPenyusutan = this.listAkunAll.filter(a => a.tipe==='Akumulasi Penyusutan')
        this.listAkunBebanPenyusutan = this.listAkunAll.filter(a => a.tipe==='Beban')

        if(this.form.get('deprMethodId').value) {
          const dm = this.listDepreciationMethod.find(e=> e.id ===this.form.get('deprMethodId').value)
          this.selectDepreciationMethod(dm)
        }
      }
    }, 1500)
  }

  selectDepreciationMethod(evt) {
    this.selectedDepr = evt;
    this.calculateRate()
  }

  calculateRate() {
    let rate = 0
    if(this.selectedDepr) {
      if(this.selectedDepr.rate == 0) {
        this.form.patchValue({
          deprAccountId: null,
          deprExpenseAccountId: null,
        })
      }
      rate = this.selectedDepr.rate / (this.form.value.ageYear + (this.form.value.ageMonth/12))
    }
    this.form.patchValue({deprRatio: rate})
  }

  get f() {
    return this.form.controls;
  }

  private onError(error) {
    if (error !== null) {
      console.log(error);
      this.toastr.error(error.error, error.message, null);
      this.isSaving = false;
    }
  }
}
