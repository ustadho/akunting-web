import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { AccKodePajakService } from '../../../../services/acc-kode-pajak.service';
import { AccCoaService } from '../../../../services/acc-coa.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-kode-pajak-form',
  templateUrl: './kode-pajak-form.component.html'
})
export class KodePajakFormComponent implements OnInit {
  title: string;
  closeBtnName: string;
  data;
  readonly: boolean;
  editForm: any;
  isSaving = false;
  id = null;
  bsModalAkunRef: BsModalRef;

  constructor(
    private eventManager: JhiEventManager,
    private accKodePajakService: AccKodePajakService,
    private accCoaService: AccCoaService,
    private fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    public bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.editForm = this.fb.group({
      id: [{ value: null, disabled: this.readonly }],
      kode: [{ value: null, disabled: this.readonly }, [Validators.required]],
      nama: [{ value: null, disabled: this.readonly }, [Validators.required]],
      nilai: [{ value: null, disabled: this.readonly }, [Validators.required]],
      keterangan: [{ value: null, disabled: this.readonly }, []],
      akunPenjualan: this.fb.group({ // make a nested group
        id: [{ value: null, disabled: this.readonly }, [Validators.required]],
      }),
      akunPembelian: this.fb.group({ // make a nested group
        id: [{ value: null, disabled: this.readonly }, [Validators.required]],
      }),
    });

    if (this.data) {
      this.id = this.data.id;
      this.updateForm(this.data);
    }
  }

  get f() {
    return this.editForm.controls;
  }

  get fj() {
    return this.editForm.get('akunPenjualan').controls;
  }

  get fk() {
    return this.editForm.get('akunPembelian').controls;
  }

  onChangeAkun(e) {
    if (e.jenis) {
      this.editForm.patchValue({
        [`${e.jenis}`]: {
          id: e.data.id,
        }
      })
    }
  }

  updateForm(data): void {
    this.editForm.patchValue({
      id: data.id,
      kode: data.kode,
      nama: data.nama,
      nilai: data.nilai,
      keterangan: data.keterangan,
      akunPenjualan: {
        id: data.akunPenjualan.id
      },
      akunPembelian: {
        id: data.akunPembelian.id
      }
    });
  }

  save() {
    this.isSaving = true;

    if (this.editForm.invalid) {
      return
    }

    if (this.id !== null) {
      this.accKodePajakService.update(this.editForm.value, this.id).subscribe(response => this.onSaveSuccess(response), (err) => this.onSaveError(err));
    } else {
      this.accKodePajakService.create(this.editForm.value).subscribe(response => this.onSaveSuccess(response), (err) => this.onSaveError(err));
    }
  }

  private onSaveSuccess(result) {
    this.toastr.success('Simpan/Update Kode Pajak sukses!', 'Sukses');
    this.isSaving = false;
    this.bsModalRef.hide();
    this.eventManager.broadcast({
      name: 'saveKodePajakSuccess',
      content: 'Save or Update Kode Pajak Success'
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
