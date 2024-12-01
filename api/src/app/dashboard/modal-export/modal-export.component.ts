import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'modal-export',
  templateUrl: './modal-export.component.html',
  styleUrls: ['./modal-export.component.scss']
})
export class ModalExportComponent implements OnInit {
  idx: number;
  tipo: string;
  type: string
  config: any;

  constructor(private activeModal: NgbActiveModal, private pdfService: PdfService) { }

  ngOnInit(): void {
  }

  share() {
    const data = JSON.parse(sessionStorage.getItem(this.tipo + this.idx + 'r'))
    this.pdfService.pdfEvent.next({ type: this.tipo, data });
  }

  close() {
    this.activeModal.close();
  }
}
