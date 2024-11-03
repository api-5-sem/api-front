import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../environments/environment';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    private notificationInterval: any;

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.notificationInterval = setInterval(() => {
            this.http.post(environment.apiUrl + 'notificacoes', { usuario: 'admin' }).subscribe()
        }, 15000)
    }

    ngOnDestroy(): void {
        if (this.notificationInterval) {
          clearInterval(this.notificationInterval);
        }
      }
}
