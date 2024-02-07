import { Component, OnInit } from '@angular/core';
import { AccDepartmentService } from '../../../services/acc-department.service';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import { DepartmentFormComponent } from './department-form/department-form.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

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
    private service: AccDepartmentService,
    private bsModalService: BsModalService
  ) {
  }

  ngOnInit(): void {
    this.loadAll();

    this.eventManager.subscribe('saveDepatmentSuccess', message => {
      this.loadAll();
    });
  }

  add() {
    const initialState = {
      data: null,
      listFAFiscal: this.listFAFiscal,
      title: 'Tambah Departemen'
    };
    this.bsModalRef = this.bsModalService.show(DepartmentFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  view(d: any) {
    const initialState = {
      data: d,
      readonly: true,
      title: 'View Departemen',
      listFAFiscal: this.listFAFiscal,
    };
    this.bsModalRef = this.bsModalService.show(DepartmentFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  edit(d: any) {
    const initialState = {
      data: d,
      readonly: false,
      title: 'Edit Departemen',
      listFAFiscal: this.listFAFiscal,
    };
    this.bsModalRef = this.bsModalService.show(DepartmentFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }

  delete(d: any) {
    swal
      .fire({
        title: 'Hapus Departemen',
        text: `Anda yakin untuk menghapus ' ${d.name}'?`,
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
