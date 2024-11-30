import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PdfService } from '../../services/pdf.service';
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'export-template',
  templateUrl: './export-template.component.html',
  styleUrls: ['./export-template.component.scss']
})
export class ExportTemplateComponent implements OnInit {
  idx: 0;
  data: any;
  request: any;
  generatedValues: any;
  type: string;

  @ViewChild('card', { static: false }) cardEl: any
  @ViewChild('graphic', { static: false }) graphicEl: any

  constructor(private pdfService: PdfService, private cdr: ChangeDetectorRef, private http: HttpClient) { }

  ngOnInit(): void {
    this.pdfService.pdfEvent.subscribe(x => {
      console.log('aaa',x)
      this.type = x.type
      this.request = this.type === 'card' ? x.data.data.request : x.data.request;
      this.data = x.data.data;
      this.generatedValues = x.data.generatedValues;
      this.cdr.detectChanges();
      if (x.modalidade == 'pdf') {
        this.export();
      }
      else {
        this.gerarRelatorio();
      }
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
  gerarRelatorio() {
    const data = this.request;
  
    const token = 'Bearer ' +localStorage.getItem("authToken");
    console.log(data)
    const command = data;
  
    this.http.post('http://localhost:8080/relatorio', command, {
      responseType: 'blob',
      observe: 'response',
      headers: {
        Authorization: token 
      }
    }).subscribe(
      (response) => {
        console.log(response)
        const blob = new Blob([response.body], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Relatorio.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erro ao gerar o relatório:', error);
      }
    );
  }
  
  
}
