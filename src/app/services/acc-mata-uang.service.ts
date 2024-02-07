import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'src/app/shared/util/request-util';

@Injectable({ providedIn: 'root' })
export class AccMataUangService {
  private resourceUrl = '/api/akunting/mata-uang';

  constructor(private http: HttpClient) { }

  create(value: any): Observable<any> {
    return this.http.post(`${this.resourceUrl}`, value);
  }

  findAll(): Observable<any> {
    return this.http.get(`${this.resourceUrl}/all`)
  }

  update(data: any): Observable<any> {
    return this.http.put(`${this.resourceUrl}/${data.id}`, data);
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }
}
