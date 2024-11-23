import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  pdfEvent = new Subject<any>();
  constructor() { }
}
