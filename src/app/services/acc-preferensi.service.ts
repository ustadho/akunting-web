import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'src/app/shared/util/request-util';

@Injectable({ providedIn: 'root' })
export class AccPreferensiService {

  private resourceUrl = '/api/akunting/preferensi';

  constructor(private http: HttpClient) { }

  findDefaultAkunMataUangById(id): Observable<any> {
    return this.http.get(`${this.resourceUrl}/default-akun-mata-uang/${id}`, {
      observe: 'response',
    });
  }

  saveDefaultAkunMataUang(data: any) {
    return this.http.post(`${this.resourceUrl}/default-akun-mata-uang`, data);
  }

  findDefaultAkunItem(): Observable<any> {
    return this.http.get(`${this.resourceUrl}/default-akun-item`, {
      observe: 'response',
    });
  }

  saveDefaultAkunItem(data: any) {
    return this.http.post(`${this.resourceUrl}/default-akun-item`, data);
  }
}
