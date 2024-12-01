import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalExportComponent } from './modal-export.component';
import { PdfService } from '../../services/pdf.service';
import { of, Subject } from 'rxjs';

describe('ModalExportComponent', () => {
  let component: ModalExportComponent;
  let fixture: ComponentFixture<ModalExportComponent>;
  let mockPdfService: any;

  beforeEach(async () => {
    mockPdfService = {
      pdfEvent: new Subject(),
    };

    await TestBed.configureTestingModule({
      declarations: [ModalExportComponent],
      providers: [
        NgbActiveModal, 
        { provide: PdfService, useValue: mockPdfService }, 
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExportComponent);
    component = fixture.componentInstance;
    component.idx = 1;
    component.tipo = 'test';
    component.type = 'example';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should share data correctly when share() is called', () => {
    const mockData = { key: 'value' };
    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(mockData));
    spyOn(mockPdfService.pdfEvent, 'next');

    component.share();


    expect(sessionStorage.getItem).toHaveBeenCalledWith('test1r');


    expect(mockPdfService.pdfEvent.next).toHaveBeenCalledWith({
      type: 'test',
      data: mockData,
    });
  });

  it('should close the modal when close() is called', () => {
    const activeModalSpy = spyOn(TestBed.inject(NgbActiveModal), 'close');

    component.close();

  
    expect(activeModalSpy).toHaveBeenCalled();
  });
});
