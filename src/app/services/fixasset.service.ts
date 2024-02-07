import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'src/app/shared/util/request-util';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class FixAssetService {
  private resourceUrl = '/api/akunting/fixasset';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  query(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.resourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  create(value: any): Observable<any> {
    return this.http.post(`${this.resourceUrl}`, value);
  }

  findAll(): Observable<any> {
    return this.http.get(`${this.resourceUrl}/all`)
  }

  findById(id): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  update(data: any, id: number): Observable<any> {
    return this.http.put(`${this.resourceUrl}/${id}`, data);
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  disposed(payload: any) {
    return this.http.post(`${this.resourceUrl}/disposed`, payload);
  }

  cancelDisposed(id: string) {
    return this.http.post(`${this.resourceUrl}/disposed-cancel`, {
      id: id,
      disposed: true
    });
  }

  saveRevaluation(req: any) {
    return this.http.post(`${this.resourceUrl}/revaluation`, req);
  }

  findRevaluationByAssetId(assetId): Observable<any> {
    return this.http.get(`${this.resourceUrl}/revaluation/${assetId}`, {
      observe: 'response',
    });
  }

  getReport(report, params, format) {
    const p = createRequestOption(params);
    const httpOptions = {
      responseType: 'arraybuffer' as 'json',
      params: p,
    };
    this.http
      .get<any>(
        `/api/report/fixasset/${report}.${format}`,
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
