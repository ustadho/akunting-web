import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccCoaService } from '../../../services/acc-coa.service';

@Component({
  selector: 'app-default-akun',
  templateUrl: './default-akun.component.html',
  styleUrls: ['./default-akun.component.css']
})
export class DefaultAkunComponent implements OnInit {
  listAkun = []
  listAkunHutang : any[] = []
  listAkunPiutang : any[] = []

  constructor(
    private coaService: AccCoaService,
  ) { }

  ngOnInit(): void {
    this.coaService.findAllTrx(0).subscribe(data=> {
      this.listAkun = data.body.map((e) => {
          return {
              id: e.id,
              nama: e.nama,
              kode: e.kode,
              namaKode : `${e.nama} - ${e.kode}`
            };
          })

        this.listAkunPiutang = data.body
        .filter(x=> x.tipe.toLowerCase().includes('piutang'))
        .map((e) => {
          return {
              id: e.id,
              nama: e.nama,
              kode: e.kode,
              namaKode : `${e.nama} - ${e.kode}`
            };
          }
        );

        this.listAkunHutang = data.body
        .filter(x=> x.tipe.toLowerCase().includes('hutang'))
        .map((e) => {
          return {
              id: e.id,
              nama: e.nama,
              kode: e.kode,
              namaKode : `${e.nama} - ${e.kode}`
            };
          }
        );

      })


  }

  save() {

  }
}
