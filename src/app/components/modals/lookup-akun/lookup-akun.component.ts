import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';
import { AccCoaService } from 'src/app/services/acc-coa.service';

@Component({
  selector: 'app-lookup-akun',
  templateUrl: './lookup-akun.component.html',
  styleUrls: ['./lookup-akun.component.css']
})
export class LookupAkunComponent implements OnInit {
  title: string;
  dataCoa = [];
  dataCoaFiltered;
  filterKode$ = ''
  filterNama$ = ''
  public event: EventEmitter<any> = new EventEmitter();
  @ViewChild('searchNama') searchElement: ElementRef;

  constructor(
    private accCoaService: AccCoaService,
    private toastr: ToastrService,
    public bsModalRef: BsModalRef,) { }

  ngOnInit(): void {
    this.accCoaService.findAllTrx(0).subscribe(
      (res: HttpResponse<any[]>) => {
        this.dataCoa = res.body
        this.dataCoaFiltered = res.body
      },
      (res: HttpResponse<any>) => this.onError(res.body))

      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.searchElement.nativeElement.focus();
      },0);
  }

  filterCoa() {
    if (this.filterKode$ === '' && this.filterNama$ === '') {
      this.dataCoaFiltered = this.dataCoa;
    } else {
      this.dataCoaFiltered = this.dataCoa.filter((x) => {
        return x.nama.toLocaleLowerCase().includes(this.filterNama$.toLocaleLowerCase()) && x.kode.toLocaleLowerCase().includes(this.filterKode$.toLocaleLowerCase())
      })
    }
  }

  onSelectedAkun(x) {
    this.event.emit(x);
    this.bsModalRef.hide()

  }

  private onError(error) {
    if (error !== null) {
      this.toastr.error(error, error, null);
    }
  }

}
