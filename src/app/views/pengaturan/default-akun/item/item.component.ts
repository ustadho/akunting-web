import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccPreferensiService } from 'src/app/services/acc-preferensi.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input()
  listAkun: any[];

  isSaving = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private preferensiService: AccPreferensiService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    setTimeout(()=> {
      this.preferensiService.findDefaultAkunItem().subscribe(res => {
        this.form.patchValue(res.body);
      })
    }, 1000)
  }

  createForm() {
    this.form = this.fb.group({
      idAkunBeban: [1, [Validators.required]],
      idAkunBelumTertagih: [null, [Validators.required]],
      idAkunDiskonItem: [null, [Validators.required]],
      idAkunHpp: [null, [Validators.required]],
      idAkunItemTerkirim: [null, [Validators.required]],
      idAkunPenjualan: [null, [Validators.required]],
      idAkunPersediaan: [null, [Validators.required]],
      idAkunReturPembelian: [null, [Validators.required]],
      idAkunReturPenjualan: [null, [Validators.required]],
    })
  }


  updateForm(d) {
    this.form.setValue({
      idAkunBeban: d.idAkunBeban,
      idAkunBelumTertagih: d.idAkunBelumTertagih,
      idAkunDiskonItem: d.idAkunDiskonItem,
      idAkunHpp: d.idAkunHpp,
      idAkunItemTerkirim: d.idAkunItemTerkirim,
      idAkunPenjualan: d.idAkunPenjualan,
      idAkunPersediaan: d.idAkunPersediaan,
      idAkunReturPembelian: d.idAkunReturPembelian,
      idAkunReturPenjualan: d.idAkunReturPenjualan,
    })
  }

  save() {
    this.isSaving = true;
    this.preferensiService.saveDefaultAkunItem(this.form.value).subscribe((response) => {
      this.isSaving = false;
    })
  }

  onCancel() {
    window.history.back();
  }

  get f() {
    return this.form.controls;
  }

}
