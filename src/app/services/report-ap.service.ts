import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'src/app/shared/util/request-util';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ReportAPService {
  private resourceUrl = '/api/report/ap';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getReport(report, params, format) {
    const p = createRequestOption(params);
    const httpOptions = {
      responseType: 'arraybuffer' as 'json',
      params: p,
    };
    this.http
      .get<any>(
        `${this.resourceUrl}/${report}.${format}`,
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
