import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  getAPI(): Promise<string> {
    return Promise.resolve('http://localhost:8080');
  }
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(public http: HttpClient, private service: StorageService) {}

  async get(req: string, options?: any) {
    const apiUrl = await this.service.getAPI();
    return this.http
      .get(`${apiUrl}/${req}`, options)
      .toPromise()
      .then((response: any) => response);
  }

  async post(req: string, value: any): Promise<any> {
    const apiUrl = await this.service.getAPI();
    return this.http
      .post(`${apiUrl}/${req}`, value)
      .toPromise()
      .then((response: any) => response);
  }

  async put(req: string, value: any, options: { headers?: HttpHeaders } = {}) {
    const apiUrl = await this.service.getAPI();
    const headers = options.headers || new HttpHeaders();
    return this.http
      .put(`${apiUrl}/${req}`, value, { headers })
      .toPromise()
      .then((response: any) => response);
  }

  async delete(req: string, body: any): Promise<any> {
    const apiUrl = await this.service.getAPI();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .delete(`${apiUrl}/${req}`, { headers, body })
      .toPromise()
      .then((response: any) => response);
  }
}
