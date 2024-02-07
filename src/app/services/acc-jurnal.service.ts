import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'src/app/shared/util/request-util';
import { options } from '@fullcalendar/core/preact';

@Injectable({ providedIn: 'root' })
export class AccJurnalService {
  private resourceUrl = '/api/akunting/jurnal';

  constructor(private http: HttpClient) { }

  query(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.resourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  saveJurnal(v: any): Observable<any> {
    if(v.id === null) {
      return this.http.post(`${this.resourceUrl}`, v);
    } else {
      return this.http.put(`${this.resourceUrl}/${v.id}`, v);
    }
  }

  saveBuktiKas(v: any): Observable<any> {
    if(v.id === null) {
      return this.http.post(`${this.resourceUrl}/bk`, v);
    } else {
      return this.http.put(`${this.resourceUrl}/bk/${v.id}`, v);
    }
  }

  findById(id: string) {
    return this.http.get(`${this.resourceUrl}/${id}`);
  }

  findBuktiKasById(id: string) {
    return this.http.get(`${this.resourceUrl}/bk/${id}`);
  }

  getNoBuktiKas(accountId: number, tipe: string, tanggal: string) {
    return this.http.get<string>(`${this.resourceUrl}/bk/get-nomor/${accountId}/${tipe}/${tanggal}`, );
  }

  deleteById(id: string) {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }
}
