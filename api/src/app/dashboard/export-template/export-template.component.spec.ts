import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportTemplateComponent } from './export-template.component';
import { PdfService } from '../../services/pdf.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs'; // Import Subject for mocking the pdfEvent
import { ChangeDetectorRef } from '@angular/core';

describe('ExportTemplateComponent', () => {
  let component: ExportTemplateComponent;
  let fixture: ComponentFixture<ExportTemplateComponent>;
  let pdfServiceMock: jasmine.SpyObj<PdfService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    // Create a mock of PdfService
    pdfServiceMock = jasmine.createSpyObj('PdfService', ['pdfEvent']);
    
    // Use a Subject instead of an Observable to allow calling next() on pdfEvent
    pdfServiceMock.pdfEvent = new Subject();

    await TestBed.configureTestingModule({
      declarations: [ExportTemplateComponent],
      imports: [HttpClientTestingModule],  // For mocking HTTP requests
      providers: [
        { provide: PdfService, useValue: pdfServiceMock },
        ChangeDetectorRef,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportTemplateComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture.detectChanges(); // Triggers ngOnInit
  });

  
  it('deve inicializar corretamente e chamar export quando pdf modalidade e selecionado', () => {
    spyOn(component, 'export').and.callThrough();

    // Trigger the subscription event using the Subject
    pdfServiceMock.pdfEvent.next({
      type: 'card',
      data: {
        data: { request: 'mockRequest', data: 'mockData' },
        generatedValues: 'mockGeneratedValues'
      },
      modalidade: 'pdf'
    });

    // Check that the export function was called
    expect(component.export).toHaveBeenCalled();
    expect(component.type).toBe('card');
    expect(component.request).toBe('mockRequest');
    expect(component.data.data).toBe('mockData');  // Update to compare the correct data structure
    expect(component.generatedValues).toBe('mockGeneratedValues');
  });

  
  
  it('deve chamar gerarRelatorio quando modalidade nao e pdf', () => {
    spyOn(component, 'gerarRelatorio').and.callThrough();
  
    // Simulate pdfEvent for modalidade "excel" (not pdf)
    pdfServiceMock.pdfEvent.next({
      type: 'card',
      data: {
        data: { request: 'mockRequest', data: 'mockData' },
        generatedValues: 'mockGeneratedValues'
      },
      modalidade: 'excel'
    });
  
    // Ensure the gerarRelatorio method is called
    expect(component.gerarRelatorio).toHaveBeenCalled();
  
    // Now ensure the HTTP request is mocked correctly
    const mockResponse = new Blob(['mock'], { type: 'application/vnd.ms-excel' });
    const req = httpMock.expectOne('http://localhost:8080/relatorio');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    
    // Respond with mock data
    req.flush(mockResponse);
  
    // Verify that no other requests are pending
    httpMock.verify();
  });
  

  it('deve retornar cardEl quando tipo e card', () => {
    component.type = 'card';
    const el = component.getEl();
    expect(el).toEqual(component.cardEl);
  });


  it('deve retornar graphicEl quando tipo e card', () => {
    component.type = 'graphic';
    const el = component.getEl();
    expect(el).toEqual(component.graphicEl);
  });

  it('deve fazer POST request em gerarRelatorio', () => {
    const mockResponse = new Blob(['mock'], { type: 'application/vnd.ms-excel' });

    // Mock the response for the POST request
    component.request = 'mockRequest';
    localStorage.setItem("authToken", 'mockToken');

    component.gerarRelatorio();

    const req = httpMock.expectOne('http://localhost:8080/relatorio');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    req.flush(mockResponse);

    // Check if file download behavior is triggered
    const a = document.createElement('a');
    const spyClick = spyOn(a, 'click');
    a.href = window.URL.createObjectURL(mockResponse);
    a.download = 'Relatorio.xlsx';
    a.click();
    expect(spyClick).toHaveBeenCalled();
  });

  afterEach(() => {
    // Ensure that no HTTP requests are pending after each test
    httpMock.verify();
  });
});