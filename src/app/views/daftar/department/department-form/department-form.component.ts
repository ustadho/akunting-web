import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { AccDepartmentService } from '../../../../services/acc-department.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css']
})
export class DepartmentFormComponent implements OnInit {
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
    private service: AccDepartmentService,
    private fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.editForm = this.fb.group({
      id: [{ value: null, disabled: this.readonly }],
      code: [{ value: null, disabled: this.readonly }, [Validators.required]],
      name: [{ value: null, disabled: this.readonly }, [Validators.required]],
      contact: [{ value: null, disabled: this.readonly }],
      description: [{ value: null, disabled: this.readonly }],
      active: [{ value: true, disabled: this.readonly }, [Validators.required]],
    });

    if (this.data) {
      this.id = this.data.id;
      this.updateForm(this.data);
    }
  }

  get f() {
    return this.editForm.controls;
  }

  updateForm(data): void {
    this.editForm.patchValue({
      id: data.id,
      code: data.code,
      name: data.name,
      contact: data.contact,
      description: data.description,
      active: data.active,
    });
  }

  save() {
    this.isSaving = true;

    if (this.editForm.invalid) {
      return
    }

    if (this.id !== null) {
      this.service.update(this.editForm.getRawValue(), this.id).subscribe(response => this.onSaveSuccess(response), (err) => this.onSaveError(err));
    } else {
      this.service.create(this.editForm.getRawValue()).subscribe(response => this.onSaveSuccess(response), (err) => this.onSaveError(err));
    }
  }

  private onSaveSuccess(result) {
    this.toastr.success('Simpan/Update Tipe Aktiva Tetap!', 'Sukses');
    this.isSaving = false;
    this.bsModalRef.hide();
    this.eventManager.broadcast({
      name: 'saveDepatmentSuccess',
      content: 'Save or Update Department'
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
