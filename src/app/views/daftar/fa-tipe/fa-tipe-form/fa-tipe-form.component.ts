import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { FATypeService } from '../../../../services/fa-tipe.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fa-tipe-form',
  templateUrl: './fa-tipe-form.component.html',
  styleUrls: ['./fa-tipe-form.component.css']
})
export class FaTipeFormComponent implements OnInit {
  title: string;
  closeBtnName: string;
  data;
  readonly: boolean;
  editForm: any;
  isSaving = false;
  id = null;
  bsModalAkunRef: BsModalRef;
  listFAFiscal: any[]
  selectedTipePajak: any = null

  constructor(
    private eventManager: JhiEventManager,
    private tipeService: FATypeService,
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
      fiscalTypeId: [{ value: null, disabled: this.readonly }, [Validators.required]],
    });

    if (this.data) {
      this.id = this.data.id;
      this.updateForm(this.data);
    }
  }

  selectFATipePajak(evt) {
    this.selectedTipePajak = evt;
  }

  get f() {
    return this.editForm.controls;
  }

  updateForm(data): void {
    this.editForm.patchValue({
      id: data.id,
      description: data.description,
      fiscalTypeId: data.fiscalType.id,
    });
    this.selectFATipePajak(data.fiscalType)
  }

  save() {
    this.isSaving = true;

    if (this.editForm.invalid) {
      return
    }

    if (this.id !== null) {
      this.tipeService.update(this.editForm.getRawValue(), this.id).subscribe(response => this.onSaveSuccess(response), (err) => this.onSaveError(err));
    } else {
      this.tipeService.create(this.editForm.getRawValue()).subscribe(response => this.onSaveSuccess(response), (err) => this.onSaveError(err));
    }
  }

  private onSaveSuccess(result) {
    this.toastr.success('Simpan/Update Tipe Aktiva Tetap!', 'Sukses');
    this.isSaving = false;
    this.bsModalRef.hide();
    this.eventManager.broadcast({
      name: 'saveFATypeSuccess',
      content: 'Save or Update Tipe Aktiva Tetap'
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
