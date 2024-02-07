import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng';
import { AccCoaService } from '../../../services/acc-coa.service';
import { HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AkunFormComponent } from './akun-form/akun-form.component';
import swal from 'sweetalert2';
import { JhiEventManager } from 'src/app/core/service/event-manager.service';

@Component({
  selector: 'app-daftar-akun',
  templateUrl: './daftar-akun.component.html'
})
export class DaftarAkunComponent implements OnInit {
  dataCoa: TreeNode[];
  bsModalRef: BsModalRef;

  constructor(
    private accCoaService: AccCoaService,
    private toastr: ToastrService,
    private bsModalService: BsModalService,
    private eventManager: JhiEventManager,
  ) { }

  ngOnInit(): void {

    this.findAll()
    this.eventManager.subscribe('saveAkunSuccess', message => {
      this.findAll();
    });
  }

  findAll() {
    this.accCoaService.findAll().subscribe(
      (res: HttpResponse<any[]>) => this.generateTreeData(res.body),
      (res: HttpResponse<any>) => this.onError(res.body))
  }

  add() {
    const initialState = {
      data: null,
      readonly: false,
      title: 'Tambah Data Akun'
    };
    this.bsModalRef = this.bsModalService.show(AkunFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');

  }

  view(x) {
    this.accCoaService.findOne(x.id).subscribe(
      (res: HttpResponse<any[]>) => {

        const initialState = {
          data: res.body,
          readonly: true,
          title: 'View Data Akun'
        };
        // Open Modal
        this.bsModalRef = this.bsModalService.show(AkunFormComponent, { initialState });
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.setClass('modal-lg');

      },
      (res: HttpResponse<any>) => this.onError(res.body))

  }
  edit(x) {
    this.accCoaService.findOne(x.id).subscribe(
      (res: HttpResponse<any[]>) => {

        const initialState = {
          data: res.body,
          readonly: false,
          title: 'Edit Data Item'
        };
        // Open Modal
        this.bsModalRef = this.bsModalService.show(AkunFormComponent, { initialState });
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.setClass('modal-lg');

      },
      (res: HttpResponse<any>) => this.onError(res.body))

  }
  delete(x) {
    swal
      .fire({
        title: 'Hapus Akun',
        text: `Anda yakin untuk menghapus Akun '${x.nama}' kode '${x.kode}'?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya Benar',
      })
      .then((result) => {
        if (result.value) {
          this.accCoaService.delete(x.id).subscribe(response => {
            this.findAll()
          });
        }
      });

  }

  generateTreeData(node, id_parent = null) {
    this.dataCoa = []
    node.map(async (data) => {
      let hsl: any = {
        data: data,
      };
      if (parseInt(data.level) === 0) {
        this.dataCoa.push(hsl)
      }

      if (data.child_count > 0) {
        hsl.children = [];
        hsl.expanded = true;
        this.generateTreeDataWithParent(node, data.id);
        // console.log(data);

      }
    })
  }
  async generateTreeDataWithParent(node, id_parent) {
    node.map(async (data) => {
      let hsl: any = {
        data: data,
      };
      if (data.id_parent === id_parent) {
        await this.dataCoa.map(async (x) => {
          if (x.data.id === id_parent) {
            if (data.child_count > 0) {
              hsl.children = [];
              hsl.expanded = true;
              this.generateTreeDataWithParent(node, data.id);

            }
            return x.children.push(hsl)
          }
        })

        this.dataCoa.map((x) => {
          if (x.children?.length > 0) {
            x.children.map((y) => {
              if (y.data.id === id_parent) {
                return y.children.push(hsl)
              }
            })
          }
        })
      }
    })

  }
  private onError(error) {
    if (error !== null) {
      this.toastr.error(error, error, null);
    }
  }

}
