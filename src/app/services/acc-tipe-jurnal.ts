import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'src/app/shared/util/request-util';

@Injectable({ providedIn: 'root' })
export class AccTipeJurnalService {
  private resourceUrl = '/api/akunting/tipe-jurnal';

  constructor(private http: HttpClient) { }
  findAll(): Observable<any> {
    return this.http.get(`${this.resourceUrl}/all`)
  }
}
