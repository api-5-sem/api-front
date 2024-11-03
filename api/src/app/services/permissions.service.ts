import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any>{
    return this.httpClient.get(environment.apiUrl + 'permissoes');
  }

  save(form:FormGroup): Observable<any>{
    return this.httpClient.post(environment.apiUrl + 'permissoes', form.value);
  }
}
