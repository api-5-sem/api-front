import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PdfService } from '../../services/pdf.service';
import jspdf from 'jspdf'
import html2canvas from 'html2canvas'

@Component({
  selector: 'export-template',
  templateUrl: './export-template.component.html',
  styleUrls: ['./export-template.component.scss']
})
export class ExportTemplateComponent implements OnInit {
  idx: 0;
  data: any;
  type: string;

  @ViewChild('card', { static: false }) cardEl: any
  @ViewChild('graphic', { static: false }) graphicEl: any

  constructor(private pdfService: PdfService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.pdfService.pdfEvent.subscribe(x => {
      this.type = x.type
      this.data = x.data;
      console.log(x)
      this.cdr.detectChanges();
      this.export();
    })
  }

  export() {
    const pdf = new jspdf()
    pdf.html(this.graphicEl.nativeElement).then(x => {
      pdf.save('PDF.pdf');
    });
  }
}
