import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccMataUangService } from 'src/app/services/acc-mata-uang.service';
import { AccPreferensiService } from 'src/app/services/acc-preferensi.service';

@Component({
  selector: 'app-matauang',
  templateUrl: './matauang.component.html',
  styleUrls: ['./matauang.component.css']
})
export class MatauangComponent implements OnInit {
  @Input()
  listAkun: any[];

  @Input()
  listAkunHutang : any[];

  @Input()
  listAkunPiutang : any[];

  isSaving = false;
  listMataUang = []
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private mataUangService: AccMataUangService,
    private preferensiService: AccPreferensiService,
  ) {
    this.createForm();
    this.mataUangService.findAll().subscribe((response) => {
      this.listMataUang = response
    })

  }

  ngOnInit(): void {

  }

  createForm() {
    this.form = this.fb.group({
      idMataUang: [1, [Validators.required]],
      idAkunHutang: [null, [Validators.required]],
      idAkunPiutang: [null, [Validators.required]],
      idAkunUMPembelian: [null, [Validators.required]],
      idAkunUMPenjualan: [null, [Validators.required]],
      idAkunDiskonPenjualan: [null, [Validators.required]],
      idAkunLRTerealisir: [null, [Validators.required]],
      idAkunLRTakTerealisir: [null, [Validators.required]],
    })
    setTimeout(()=> {
      this.onMataUangChange(this.listMataUang[0])
    }, 1000)
  }

  onMataUangChange(e) {
    this.preferensiService.findDefaultAkunMataUangById(e.id).subscribe((response) => {
      this.updateForm(response.body)
    })
  }

  updateForm(d) {
    this.form.setValue({
      idMataUang: d.idMataUang,
      idAkunHutang: d.idAkunHutang,
      idAkunPiutang: d.idAkunPiutang,
      idAkunUMPembelian: d.idAkunUMPembelian,
      idAkunUMPenjualan: d.idAkunUMPenjualan,
      idAkunDiskonPenjualan: d.idAkunDiskonPenjualan,
      idAkunLRTerealisir: d.idAkunLRTerealisir,
      idAkunLRTakTerealisir: d.idAkunLRTakTerealisir,
    })
  }

  save() {
    this.isSaving = true;
    this.preferensiService.saveDefaultAkunMataUang(this.form.value).subscribe((response) => {
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
