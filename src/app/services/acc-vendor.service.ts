import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'src/app/shared/util/request-util';

@Injectable({ providedIn: 'root' })
export class AccVendorService {
  private resourceUrl = '/api/akunting/vendor';

  constructor(private http: HttpClient) { }

  query(req?: any): Observable<HttpResponse<any[]>> {
    // const options = createRequestOption(req);
    const options = {q: ''}
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

  findOne(id): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
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
