import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, forwardRef } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpResponse } from '@angular/common/http';
import { AccCoaService } from '../../services/acc-coa.service';
import { ToastrService } from 'ngx-toastr';
import { LookupAkunComponent } from '../modals/lookup-akun/lookup-akun.component';

@Component({
  selector: 'app-input-pencarian-akun',
  templateUrl: './input-pencarian-akun.component.html'
})
export class InputPencarianAkunComponent implements OnInit, OnChanges {

  editForm: any;
  bsModalRef: BsModalRef;

  @Input() isSaving: boolean;
  @Input() readonly: boolean;
  @Input() jenis;
  @Input() data;

  @Output()
  change: EventEmitter<{ data: any, jenis: string }> = new EventEmitter<{ data: any, jenis: string }>();

  constructor(
    private accCoaService: AccCoaService,
    private fb: FormBuilder,
    private bsModalService: BsModalService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {

    this.editForm = this.fb.group({
      id: [{ value: null, disabled: this.readonly }, [Validators.required]],
      kode: [{ value: null, disabled: this.readonly }, [Validators.required]],
      nama: [{ value: null, disabled: true }, [Validators.required]],
    })

    if (this.data) {
      this.updateForm(this.data);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      this.updateForm(this.data);
    }
  }

  get f() {
    return this.editForm.controls;
  }

  updateForm(data): void {
    if (data.id && this.editForm) {
      this.editForm.patchValue({
        id: data.id,
        kode: data.kode,
        nama: data.nama
      });
    }
  }

  openLookupAkun() {
    const initialState = {
      data: null,
      readonly: false,
      title: 'Pilih Data Akun ' + this.jenis
    };
    this.bsModalRef = this.bsModalService.show(LookupAkunComponent, { initialState });
    this.bsModalRef.setClass('modal-lg');
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((x) => {
      this.editForm.patchValue({
        id: x.id,
        kode: x.kode,
        nama: x.nama
      })

      this.change.emit({ data: this.editForm.value, jenis: this.jenis });

    })
  }
  findAkunByKode(event) {
    event.preventDefault();

    let kode = this.editForm.get('kode').value

    this.accCoaService.findByKode(kode).subscribe(
      (res: HttpResponse<any>) => {
        this.editForm.patchValue({
          id: res.body.id,
          kode: res.body.kode,
          nama: res.body.nama
        })
        this.change.emit({ data: this.editForm.value, jenis: this.jenis });
      },
      (res: HttpResponse<any>) => this.onSaveError(res.status === 404 ? 'Kode Akun Not Found' : res.body))
  }
  private onSaveError(err) {
    this.toastr.error('Errror!', err);
  }

}
