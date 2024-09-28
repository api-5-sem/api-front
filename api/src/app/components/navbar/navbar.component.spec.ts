import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [HttpClientTestingModule], // Adiciona o HttpClientTestingModule
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController); 
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('Devera ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('Devera  aparecer o spinner quando isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const loadingElement = fixture.debugElement.query(By.css('.loading'));
    expect(loadingElement).toBeTruthy(); 
  });

  it('Devera  esconder o spinner quando isLoading is false', () => {
    component.isLoading = false;
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('.loading'));
    expect(loadingElement).toBeFalsy(); 
  });

  it('Devera trigger file input e setar isLoading quando true e quando o import button é clicado', fakeAsync(() => {
    spyOn(component, 'triggerFileInput'); 


    const importButton = fixture.debugElement.query(By.css('button[aria-label="Importar dados"]'));
    importButton.nativeElement.click();

    fixture.detectChanges();

    expect(component.triggerFileInput).toHaveBeenCalled(); 
    expect(component.isLoading).toBeTrue(); 

    
    const mockFile = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const event = { target: { files: [mockFile] } } as unknown as Event;
    component.importDadosProvisionados(event);
    
    
    const req = httpMock.expectOne('http://localhost:8080/importacao');
    expect(req.request.method).toBe('POST');

    req.flush({ message: 'Arquivo enviado com sucesso' }); 
    tick(); 
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse(); 
  }));

  it('should hide the spinner if the file upload fails', fakeAsync(() => {
    const mockFile = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const event = { target: { files: [mockFile] } } as unknown as Event;
    component.importDadosProvisionados(event);

    const req = httpMock.expectOne('http://localhost:8080/importacao');
    expect(req.request.method).toBe('POST');

    req.flush('Erro ao enviar arquivo', { status: 500, statusText: 'Internal Server Error' });
    tick(); 
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse(); 
  }));
});
