import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { FATipePajakService } from '../../../../services/fa-tipe-pajak.service';
import { FADepreciationMethodService } from '../../../../services/fa-depreciation-method.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fa-tipe-pajak-form',
  templateUrl: './fa-tipe-pajak-form.component.html',
  styleUrls: ['./fa-tipe-pajak-form.component.css']
})
export class FaTipePajakFormComponent implements OnInit {
  title: string;
  closeBtnName: string;
  data;
  readonly: boolean;
  editForm: any;
  isSaving = false;
  id = null;
  bsModalAkunRef: BsModalRef;
  listDepreciationMethod: any[]
  selectedDepr: any = null

  constructor(
    private eventManager: JhiEventManager,
    private tipePajakService: FATipePajakService,
    private depreciationMethodService: FADepreciationMethodService,
    private fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    public bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.editForm = this.fb.group({
      id: [{ value: null, disabled: this.readonly }],
      description: [{ value: null, disabled: this.readonly }, [Validators.required]],
      estimationLive: [{ value: 0, disabled: this.readonly }, [Validators.required]],
      rate: [{ value: 0, disabled: true }, [Validators.required]],
      depreciationMethodId: [{ value: null, disabled: this.readonly }, [Validators.required]],
    });

    if (this.data) {
      this.id = this.data.id;
      this.updateForm(this.data);
    }
  }

  selectDepreciationMethod(evt) {
    this.selectedDepr = evt;
    this.calculateRate()
  }

  calculateRate() {
    let rate = 0
    if(this.selectedDepr) {
      if(this.selectedDepr.rate === 0)
        return

      rate = this.selectedDepr.rate / this.editForm.value.estimationLive
    }
    this.editForm.patchValue({rate: rate})
  }

  get f() {
    return this.editForm.controls;
  }

  updateForm(data): void {
    this.editForm.patchValue({
      id: data.id,
      description: data.description,
      estimationLive: data.estimationLive,
      rate: data.rate,
      depreciationMethodId: data.depreciationMethod.id,
    });
  }

  save() {
    this.isSaving = true;

    if (this.editForm.invalid) {
      return
    }
    if(this.selectedDepr && this.selectedDepr.rate === 0 && this.editForm.value.estimationLive > 0) {
      this.toastr.error('Estimasi umur seharusnya Nol.')
      return
    } else {
      if (this.id !== null) {
        this.tipePajakService.update(this.editForm.getRawValue(), this.id).subscribe(response => this.onSaveSuccess(response), (err) => this.onSaveError(err));
      } else {
        this.tipePajakService.create(this.editForm.getRawValue()).subscribe(response => this.onSaveSuccess(response), (err) => this.onSaveError(err));
      }
    }
  }

  private onSaveSuccess(result) {
    this.toastr.success('Simpan/Update Tipe Aktiva Tetap Pajak!', 'Sukses');
    this.isSaving = false;
    this.bsModalRef.hide();
    this.eventManager.broadcast({
      name: 'saveFATipePajakSuccess',
      content: 'Save or Update Tipe Aktiva Tetap Pajak'
    });
  }

  private onSaveError(err) {
    this.toastr.error('Errror!', err);
    this.isSaving = false;
  }

  cancel() {
    this.bsModalRef.hide();
  }

  previousState(): void {
    window.history.back();
  }

}
