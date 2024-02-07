import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { AccPeriodEndService } from '../../../../../services/acc-period-end.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-period-end-dialog',
  templateUrl: './period-end-dialog.component.html',
  styleUrls: ['./period-end-dialog.component.css'],
})
export class PeriodEndDialogComponent implements OnInit {
  title: string;
  closeBtnName: string;
  data;
  readonly: boolean;
  editForm: any;
  isSaving = false;
  id = null;
  bsModalAkunRef: BsModalRef;
  listFAFiscal: any[];
  selectedTipePajak: any = null;
  bulans = [
    {id: 1, name: "Januari"},
    {id: 2, name: "Februari"},
    {id: 3, name: "Maret"},
    {id: 4, name: "April"},
    {id: 5, name: "Mei"},
    {id: 6, name: "Juni"},
    {id: 7, name: "Juli"},
    {id: 8, name: "Agustus"},
    {id: 9, name: "September"},
    {id: 10, name: "Oktober"},
    {id: 11, name: "November"},
    {id: 12, name: "Desember"},
  ]

  constructor(
    private eventManager: JhiEventManager,
    private service: AccPeriodEndService,
    private fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      id: [{ value: null, disabled: this.readonly }],
      period: [new Date().getMonth()+1, [Validators.required]],
      tahun: [new Date().getFullYear(), [Validators.required]],
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
      period: data.period,
      tahun: data.tahun,
    });
  }

  save() {
    this.isSaving = true;

    if (this.editForm.invalid) {
      return;
    }

    if (this.id === null) {
      this.service.create(this.editForm.getRawValue()).subscribe(
        (response) => this.onSaveSuccess(response),
        (err) => this.onSaveError(err)
      );
    }
  }

  private onSaveSuccess(result) {
    this.toastr.success('Period End berhasil disimpan!', 'Sukses');
    this.isSaving = false;
    this.bsModalRef.hide();
    this.eventManager.broadcast({
      name: 'savePeriodEndSuccess',
      content: 'Save Period End',
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
