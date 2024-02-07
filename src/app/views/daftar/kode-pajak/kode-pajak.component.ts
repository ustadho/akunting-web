import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Component, OnInit } from '@angular/core';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { AccKodePajakService } from '../../../services/acc-kode-pajak.service';
import { KodePajakFormComponent } from './kode-pajak-form/kode-pajak-form.component';

@Component({
  selector: 'app-kode-pajak',
  templateUrl: './kode-pajak.component.html'
})
export class KodePajakComponent implements OnInit {
  currentData: any;
  listData: [];
  error: any;
  success: any;
  routeData: any;
  links: any;
  bsModalRef: BsModalRef;

  constructor(
    private eventManager: JhiEventManager,
    private accKodePajakService: AccKodePajakService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private bsModalService: BsModalService
  ) {
  }

  ngOnInit(): void {
    this.loadAll();

    this.eventManager.subscribe('saveKodePajakSuccess', message => {
      this.loadAll();
    });
  }

  add() {
    const initialState = {
      data: null,
      title: 'Tambah Data Kode Pajak'
    };
    this.bsModalRef = this.bsModalService.show(KodePajakFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  view(d: any) {
    const initialState = {
      data: d,
      readonly: true,
      title: 'View Data Kode Pajak'
    };
    this.bsModalRef = this.bsModalService.show(KodePajakFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  edit(d: any) {
    const initialState = {
      data: d,
      readonly: false,
      title: 'Edit Kode Pajak'
    };
    this.bsModalRef = this.bsModalService.show(KodePajakFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  delete(k: any) {
    swal
      .fire({
        title: 'Hapus Kode Pajak',
        text: `Anda yakin untuk menghapus ' ${k.nama}'?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya Benar',
      })
      .then((result) => {
        if (result.value) {
          this.accKodePajakService.delete(k.kode).subscribe(response => {
            this.loadAll();
          });
        }
      });
  }

  loadAll() {
    this.accKodePajakService
      .findAll()
      .subscribe((body) => {
        this.onSuccess(body)
      });
  }

  private onSuccess(data) {
    this.listData = data;
  }

  private onError(error) {
    // this.alertService.error(error.error, error.message, null);
  }
}
