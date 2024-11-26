import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PdfService } from '../../services/pdf.service';
import { jsPDF } from 'jspdf'
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

      this.cdr.detectChanges();
      this.export();
    })
  }

  getEl() {
    if (this.type === 'card') {
      return this.cardEl;
    }

    return this.graphicEl
  }

  export() {
    const el = this.getEl()
    setTimeout(() => {
      html2canvas(el.nativeElement, {
        allowTaint: true,
      }).then((canvas) => {
        var img = canvas.toDataURL("image/PNG");
        var doc = new jsPDF('l', 'mm', 'a4');

        const bufferX = 5;
        const bufferY = 5;
        const imgProps = doc.getImageProperties(img);

        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

        doc.output('dataurlnewwindow');
      })
    }, 2000)
  }
}
