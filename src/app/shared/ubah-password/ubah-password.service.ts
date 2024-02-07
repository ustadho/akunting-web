import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private resourceUrl = environment.SERVER_API_URL;
  constructor(private http: HttpClient) {}

  save(newPassword: string, currentPassword: string): Observable<{}> {
    return this.http.post(this.resourceUrl + 'api/account/change-password', {
      currentPassword,
      newPassword,
    });
  }
}
