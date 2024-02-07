import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import swal from 'sweetalert2';
import { FATipePajakService } from '../../../services/fa-tipe-pajak.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FADepreciationMethodService } from '../../../services/fa-depreciation-method.service';
import { HttpResponse } from '@angular/common/http';
import { FaTipePajakFormComponent } from './fa-tipe-pajak-form/fa-tipe-pajak-form.component';
@Component({
  selector: 'app-fa-tipe-pajak',
  templateUrl: './fa-tipe-pajak.component.html',
  styleUrls: ['./fa-tipe-pajak.component.css']
})
export class FaTipePajakComponent implements OnInit {

  currentData: any;
  listData: [];
  listDepreciationMethod: any[] = [];
  error: any;
  success: any;
  routeData: any;
  links: any;
  bsModalRef: BsModalRef;

  constructor(
    private eventManager: JhiEventManager,
    private service: FATipePajakService,
    private depreciationMethodService: FADepreciationMethodService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private bsModalService: BsModalService
  ) {
  }

  ngOnInit(): void {
    this.loadAll();

    this.eventManager.subscribe('saveFATipePajakSuccess', message => {
      this.loadAll();
    });

    this.depreciationMethodService.findAll().subscribe(
      (res: any[]) => {
        this.listDepreciationMethod = res;
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );
  }

  add() {
    const initialState = {
      data: null,
      listDepreciationMethod: this.listDepreciationMethod,
      title: 'Tambah Aktiva Tetap Pajak'
    };
    this.bsModalRef = this.bsModalService.show(FaTipePajakFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  view(d: any) {
    const initialState = {
      data: d,
      readonly: true,
      title: 'View Tipe Aktiva Tetap Pajak',
      listDepreciationMethod: this.listDepreciationMethod,
    };
    this.bsModalRef = this.bsModalService.show(FaTipePajakFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  edit(d: any) {
    const initialState = {
      data: d,
      readonly: false,
      title: 'Edit Tipe Aktiva Tetap Pajak',
      listDepreciationMethod: this.listDepreciationMethod,
    };
    this.bsModalRef = this.bsModalService.show(FaTipePajakFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  delete(d: any) {
    swal
      .fire({
        title: 'Hapus Aktiva Tipe Pajak',
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
