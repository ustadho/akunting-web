import { Component, OnInit } from '@angular/core';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { FATypeService } from '../../../../services/fa-tipe.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FixAssetService } from '../../../../services/fixasset.service';
import { ToastrService } from 'ngx-toastr';
import { AccDepartmentService } from '../../../../services/acc-department.service';
import { HttpResponse } from '@angular/common/http';
import swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FixassetFormDisposedComponent } from './fixasset-form-disposed/fixasset-form-disposed.component';
import { AccCoaService } from '../../../../services/acc-coa.service';
import Swal from 'sweetalert2';
import { FixassetFormRevaluationComponent } from './fixasset-form-revaluation/fixasset-form-revaluation.component';

@Component({
  selector: 'app-fixasset-form',
  templateUrl: './fixasset-form.component.html',
  styleUrls: ['./fixasset-form.component.css'],
})
export class FixAssetFormComponent implements OnInit {
  title: string;
  closeBtnName: string;
  data: any;
  readonly: boolean;
  form: any;
  isSaving = false;
  id = null;
  listFixassetType: any[];
  listDepartment: any[];
  listAkunAll: any[];
  selectedTipePajak: any = null;
  routeData: any;
  allowEditing = true

  constructor(
    private eventManager: JhiEventManager,
    private service: FixAssetService,
    private faTypeService: FATypeService,
    private departmentService: AccDepartmentService,
    private accAkunService: AccCoaService,
    private fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
  ) {}

  ngOnInit() {
    this.faTypeService.findAll().subscribe(
      (res: any[]) => {
        this.listFixassetType = res;
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );
    this.departmentService.findAll().subscribe(
      (res: any[]) => {
        this.listDepartment = res;
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );

    this.accAkunService.findAllTrx(0).subscribe(
      (res: any) => {
        this.listAkunAll = res.body;
        this.listAkunAll.map((e) => {
          e.fullName = `${e.nama} [${e.kode}]`;
        });
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );

    this.createForm();
    this.routeData = this.activatedRoute.data.subscribe(({ data }) => {
      this.data = data;
      if (data) {
        this.id = data.body.id;
        this.updateForm(data.body ? data.body : data);
      }
    });
    this.eventManager.subscribe('saveFixassetDisposedSuccess', (message) => {
      if(this.id === null || this.id === undefined)
        return

      this.service.findById(this.id).subscribe((res: any)=> {
        this.data = res.body ? res.body : res
        this.updateForm(this.data)
      },
      (res: any) => this.onError(res.body)
      );
      // location.reload();
      // const currentUrl = this.router.url;
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this.router.navigate([currentUrl]);
      // });
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [{ value: null, disabled: this.readonly }],
      code: [{ value: null, disabled: this.readonly }, [Validators.required]],
      name: [{ value: null, disabled: this.readonly }, [Validators.required]],
      notes: [{ value: null, disabled: this.readonly }],
      intagible: [
        { value: false, disabled: this.readonly },
        [Validators.required],
      ],
      fiscalAsset: [
        { value: false, disabled: this.readonly },
        [Validators.required],
      ],
      purchaseDate: [
        { value: new Date(), disabled: this.readonly },
        [Validators.required],
      ],
      usageDate: [
        { value: new Date(), disabled: this.readonly },
        [Validators.required],
      ],
      estimatedLive: [
        { value: 0, disabled: this.readonly },
        [Validators.required],
      ],
      deprMethodId: [
        { value: null, disabled: this.readonly },
        [Validators.required],
      ],
      deprRatio: [0],
      cost: [{ value: 0, disabled: this.readonly }, [Validators.required]],
      typeId: [{ value: null, disabled: this.readonly }, [Validators.required]],
      departmentId: [{ value: null, disabled: this.readonly }],
      faAccountId: [
        { value: null, disabled: this.readonly },
        [Validators.required],
      ],
      deprAccountId: [{ value: null, disabled: this.readonly }],
      deprExpenseAccountId: [{ value: null, disabled: this.readonly }],
      quantity: [
        { value: 1, disabled: this.readonly },
        [Validators.required, Validators.min(1)],
      ],
      quantityBalance: [
        { value: 0, disabled: this.readonly },
        [Validators.required],
      ],
      ageYear: [
        { value: 0, disabled: this.readonly },
        [Validators.required, Validators.min(1)],
      ],
      ageMonth: [{ value: 0, disabled: this.readonly }, [Validators.required]],
      amountOfStopped: [
        { value: 0, disabled: this.readonly },
        [Validators.required],
      ],
      amountOfDepreciation: [
        { value: 0, disabled: this.readonly },
        [Validators.required],
      ],
      amountOfAccountingValue: [
        { value: 0, disabled: this.readonly },
        [Validators.required],
      ],
      residu: [
        { value: 0, disabled: this.readonly },
        [Validators.required],
      ],
      lastJournalDate: [
        { value: null, disabled: true },
      ],
      disposed: [false],

      detail: this.fb.array([]),
    });
  }

  selectFATipePajak(evt) {
    this.selectedTipePajak = evt;
  }

  get f() {
    return this.form.controls;
  }

  updateForm(data): void {
    this.allowEditing = data.allowEditing
    this.form.patchValue({
      id: data.id,
      code: data.code,
      name: data.name,
      notes: data.notes,
      intagible: data.intagible,
      fiscalAsset: data.fiscalAsset,
      purchaseDate: new Date(data.purchaseDate),
      usageDate: new Date(data.usageDate),
      estimatedLive: data.estimatedLive,
      deprMethodId: data.deprMethodId,
      deprRatio: data.deprRatio,
      cost: data.cost,
      typeId: data.typeId,
      departmentId: data.departmentId,
      faAccountId: data.faAccountId,
      deprAccountId: data.deprAccountId,
      deprExpenseAccountId: data.deprExpenseAccountId,
      quantity: data.quantity,
      quantityBalance: data.quantityBalance,
      ageYear: data.ageYear,
      ageMonth: data.ageMonth,
      amountOfStopped: data.amountOfStopped,
      amountOfDepreciation: data.amountOfDepreciation,
      amountOfAccountingValue: data.amountOfAccountingValue,
      residu: data.residu,
      disposed: data.disposed,
      lastJournalDate: data.lastJournalDate,
      detail: [],
    });
    const detail = this.form.get('detail') as FormArray;
    detail.reset()

    data.detail.forEach((e) => {
      detail.push(
        this.fb.group({
          id: e.id,
          seq: e.seq,
          akunId: [e.akunId, [Validators.required]],
          akunCode: e.akunCode,
          amount: [e.amount, [Validators.required, Validators.min(1)]],
          description: e.description,
          expDate: [new Date(e.expDate), [Validators.required]],
        })
      );
    });
  }

  async save() {
    this.validateAllFormFields(this.form);
    await this.form.value.detail.forEach((d) => {
      if (d.amount == 0) {
        this.toastr.error('Kolom Jumlah tidak boleh Nol');
        return;
      }
    });
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
    if (this.form.value.detail.length == 0) {
      this.toastr.error('Sumber dana belum dimasukkan');
      return;
    }
    if (this.form.value.cost == 0) {
      this.toastr.error('Nilai aset masih Nol');
      return;
    }

    if (this.id !== null) {
      this.service.update(this.form.getRawValue(), this.id).subscribe(
        (response) => {
          this.onSaveSuccess(response);
        },
        (err) => this.onError(err)
      );
    } else {
      this.service.create(this.form.getRawValue()).subscribe(
        (response) => this.onSaveSuccess(response),
        (err) => this.onError(err)
      );
    }
  }

  onDisposed() {
    const initialState = {
      title: 'Konfirmasi Penghentian Aktiva Tetap',
      listAkunAll: this.listAkunAll,
      fixAssetId: this.id,
      fixAssetData: this.data.body,
      quantityBalance: this.form.value.quantityBalance,
    };
    this.bsModalRef = this.bsModalService.show(FixassetFormDisposedComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  onCancelDisposed() {
    Swal.fire({
      title: `Batal Disposed`,
      text: `Anda yakin untuk membatalkan diposed fixasset??`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Tidak',
      confirmButtonText: 'Ya Batalkan Disposed',
    }).then((result) => {
      if (result.value) {
        this.service.cancelDisposed(this.id).subscribe(
          (response) => {
            this.eventManager.broadcast({
              name: 'saveFixassetDisposedSuccess',
              content: 'Batal Dispose Fix Asset',
            });
          },
          (res: HttpResponse<any>) => this.onError(res.body)
        );
      }
    });
  }

  async onRevaluation() {
    await this.service.findRevaluationByAssetId(this.id).subscribe(
      (res) => {
        const initialState = {
          title: 'Revaluasi Aktiva Tetap',
          listAkunAll: this.listAkunAll,
          fixAssetId: this.id,
          data: res.body,
        };
        this.bsModalRef = this.bsModalService.show(
          FixassetFormRevaluationComponent,
          { initialState }
        );
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.setClass('modal-lg');
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );
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

  onPrint() {
    this.service.getReport('print', {id: this.id}, 'pdf')
  }

  private onSaveSuccess(result) {
    this.toastr.success('Simpan/Update Aktiva Tetap Sukses!', 'Sukses');
    this.isSaving = false;
    this.eventManager.broadcast({
      name: 'saveFixassetSuccess',
      content: 'Save or Update Aktiva Tetap',
    });
    this.previousState();
  }

  private onError(error) {
    if (error !== null) {
      console.log(error);
      this.toastr.error(error.error, error.message, null);
      this.isSaving = false;
    }
  }

  previousState(): void {
    window.history.back();
  }

  onCancel() {
    // if (this.form.value.detail.length == 0) {
    window.history.back();
    //   return;
    // }
  }
}
