import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'src/app/shared/util/request-util';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AccAPPaymentService {
  private resourceUrl = '/api/akunting/ap-payment';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  save(v: any): Observable<any> {
    if(v.id === null) {
      return this.http.post(`${this.resourceUrl}`, v);
    } else {
      return this.http.put(`${this.resourceUrl}/${v.id}`, v);
    }
  }

  findById(id: string) {
    return this.http.get(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.resourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  deleteById(id: string) {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  findOustandingByVendor(id) {
    return this.http.get(`${this.resourceUrl}/outstanding-by-vendor/${id}`);
  }

  getReport(report, params, format) {
    const p = createRequestOption(params);
    const httpOptions = {
      responseType: 'arraybuffer' as 'json',
      params: p,
    };
    this.http
      .get<any>(
        `/api/report/ap/${report}.${format}`,
        httpOptions
      )
      .subscribe((res) => {
        const file = new Blob([res], { type: 'application/' + format });
        const fileURL = URL.createObjectURL(file);
        if (format === 'pdf') window.open(fileURL);
        else {
          var fileLink = document.createElement('a');
          fileLink.href = fileURL;
          fileLink.download = `${report}.xlsx`;
          fileLink.click();
        }
      },
      (res: HttpResponse<any>) => this.onError(res)
      )
  }

  private onError(error) {
    console.log(error)
    if (!error.ok) {
      this.toastr.error("Report tidak ditemukan!")
    }
    // this.alertService.error(error.error, error.message, null);
  }
}
