import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import { FATypeService } from '../../../services/fa-tipe.service';
import { FATipePajakService } from '../../../services/fa-tipe-pajak.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { HttpResponse } from '@angular/common/http';
import { FaTipeFormComponent } from './fa-tipe-form/fa-tipe-form.component';
@Component({
  selector: 'app-fa-tipe',
  templateUrl: './fa-tipe.component.html',
  styleUrls: ['./fa-tipe.component.css']
})
export class FaTipeComponent implements OnInit {
  currentData: any;
  listData: [];
  listFAFiscal: any[] = [];
  error: any;
  success: any;
  routeData: any;
  links: any;
  bsModalRef: BsModalRef;

  constructor(
    private eventManager: JhiEventManager,
    private service: FATypeService,
    private faFiscalService: FATipePajakService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private bsModalService: BsModalService
  ) {
  }

  ngOnInit(): void {
    this.loadAll();

    this.eventManager.subscribe('saveFATypeSuccess', message => {
      this.loadAll();
    });

    this.faFiscalService.findAll().subscribe(
      (res: any[]) => {
        this.listFAFiscal = res;
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );
  }

  add() {
    const initialState = {
      data: null,
      listFAFiscal: this.listFAFiscal,
      title: 'Tambah Aktiva Tetap'
    };
    this.bsModalRef = this.bsModalService.show(FaTipeFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  view(d: any) {
    const initialState = {
      data: d,
      readonly: true,
      title: 'View Tipe Aktiva Tetap',
      listFAFiscal: this.listFAFiscal,
    };
    this.bsModalRef = this.bsModalService.show(FaTipeFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  edit(d: any) {
    const initialState = {
      data: d,
      readonly: false,
      title: 'Edit Tipe Aktiva Tetap',
      listFAFiscal: this.listFAFiscal,
    };
    this.bsModalRef = this.bsModalService.show(FaTipeFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  delete(d: any) {
    swal
      .fire({
        title: 'Hapus Tipe Aktiva Tetap',
        text: `Anda yakin untuk menghapus ' ${d.description}'?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya Benar',
      })
      .then((result) => {
        if (result.value) {
          this.service.delete(d.id).subscribe(response => {
            this.loadAll();
          });
        }
      });
  }

  loadAll() {
    this.service
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
