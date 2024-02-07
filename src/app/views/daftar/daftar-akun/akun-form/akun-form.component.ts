import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { AccCoaService } from '../../../../services/acc-coa.service';
import { AccTipeAkunService } from '../../../../services/acc-tipe-akun.service';
import { AccMataUangService } from '../../../../services/acc-mata-uang.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-akun-form',
  templateUrl: './akun-form.component.html'
})
export class AkunFormComponent implements OnInit {
  title: string;
  closeBtnName: string;
  data: any;
  readonly: boolean;
  editForm: FormGroup;
  isSaving = false;
  listTipe = []
  listMataUang = []
  listParent = []
  isHasParent: boolean = false;
  idParentError: boolean = false;

  constructor(
    private accCoaService: AccCoaService,
    private accTipeAkunService: AccTipeAkunService,
    private accMataUangService: AccMataUangService,
    private eventManager: JhiEventManager,
    private fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.findAllSelect()

    this.initForm()

    setTimeout(() => {
      if (this.data) {
        this.updateForm(this.data);
      }
    }, 100);

  }

  get f() {
    return this.editForm.controls;
  }

  findAllSelect() {
    this.accTipeAkunService.findAll().subscribe((response) => {
      this.listTipe = response
    })

    this.accMataUangService.findAll().subscribe((response) => {
      this.listMataUang = response
    })

    this.accCoaService.findAll().subscribe(
      async (res: HttpResponse<any[]>) => {
        await res.body.map((x) => {
          this.listParent = [...this.listParent, {
            id: x.id,
            nama: `${x.kode} - ${x.nama}`
          }]
        })
      },
      (res: HttpResponse<any>) => this.onError(res.body))
  }

  initForm() {

    this.editForm = this.fb.group({
      id: [{ value: null, disabled: this.readonly }, []],
      nama: [{ value: null, disabled: this.readonly }, [Validators.required]],
      kode: [{ value: null, disabled: this.readonly }, [Validators.required]],
      tipeId: [{ value: null, disabled: this.readonly }, [Validators.required]],
      aktif: [{ value: true, disabled: this.readonly }],
      mataUangId: [{ value: null, disabled: this.readonly }, []],
      parentId: [{ value: null, disabled: this.readonly }, []],
      keterangan: [{ value: null, disabled: this.readonly }, []],
      kodeMasuk: [{ value: null, disabled: this.readonly }, []],
      kodeKeluar: [{ value: null, disabled: this.readonly }, []],
    });
  }

  updateForm(data) {
    this.editForm.patchValue({
      id: data.id,
      nama: data.nama,
      kode: data.kode,
      tipeId: data.tipe ? data.tipe.id : null,
      aktif: data.aktif,
      mataUangId: data.mataUang ? data.mataUang.id : null,
      parentId: data.parent ? data.parent.id : null,
      kodeMasuk: data.kodeMasuk,
      kodeKeluar: data.kodeKeluar,
      keterangan: data.keterangan,
    });

    if (data.parent) this.isHasParent = true

  }

  save() {
    this.isSaving = true;

    if (this.isHasParent && !this.editForm.value.parentId) this.idParentError = true

    if (this.editForm.invalid || this.idParentError) return

    if (this.editForm.value.id !== null) {
      this.accCoaService.update(this.editForm.value).subscribe(
        (response) => this.onSaveSuccess(response),
        (err) => this.onSaveError(err)
      );
    } else {
      this.accCoaService.create(this.editForm.value).subscribe(
        (response) => this.onSaveSuccess(response),
        (err) => this.onSaveError(err)
      );
    }

  }

  private onSaveSuccess(result) {
    this.toastr.success('Simpan/Update Data Akun sukses!', 'Sukses');
    this.isSaving = false;
    this.bsModalRef.hide();
    this.eventManager.broadcast({
      name: 'saveAkunSuccess',
      content: 'Save or Update Data Akun Success',
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

  private onError(error) {
    this.toastr.error(error);
  }

}
