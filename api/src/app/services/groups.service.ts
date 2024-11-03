import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any>{
    return this.httpClient.get(environment.apiUrl + 'usuarios/grupos');
  }
}
