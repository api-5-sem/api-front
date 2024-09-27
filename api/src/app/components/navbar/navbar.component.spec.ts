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
    httpMock = TestBed.inject(HttpTestingController); // Injeta o HttpTestingController
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que não há requisições pendentes após cada teste
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the loading spinner when isLoading is true', () => {
    // Definindo isLoading como true para exibir o spinner
    component.isLoading = true;
    fixture.detectChanges();

    // Procurar pelo elemento com a classe 'loading'
    const loadingElement = fixture.debugElement.query(By.css('.loading'));
    expect(loadingElement).toBeTruthy(); // Verificar se o elemento existe
  });

  it('should hide the loading spinner when isLoading is false', () => {
    // Definindo isLoading como false para ocultar o spinner
    component.isLoading = false;
    fixture.detectChanges();

    // Procurar pelo elemento com a classe 'loading'
    const loadingElement = fixture.debugElement.query(By.css('.loading'));
    expect(loadingElement).toBeFalsy(); // Verificar se o elemento não existe
  });

  it('should trigger file input and set isLoading to true when the import button is clicked', fakeAsync(() => {
    spyOn(component, 'triggerFileInput'); // Espia o método triggerFileInput

    // Procurar pelo botão de importação e simular um clique
    const importButton = fixture.debugElement.query(By.css('button[aria-label="Importar dados"]'));
    importButton.nativeElement.click();

    fixture.detectChanges();

    expect(component.triggerFileInput).toHaveBeenCalled(); // Verifica se o método foi chamado
    expect(component.isLoading).toBeTrue(); // isLoading deve ser true após o clique

    // Simular a seleção de arquivo e disparar o evento change
    const mockFile = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const event = { target: { files: [mockFile] } } as unknown as Event;
    component.importDadosProvisionados(event);
    
    // Simula a requisição e resposta HTTP
    const req = httpMock.expectOne('http://localhost:8080/importacao');
    expect(req.request.method).toBe('POST');

    req.flush({ message: 'Arquivo enviado com sucesso' }); // Simula uma resposta bem-sucedida do servidor
    tick(); // Avança no tempo para que o Observable finalize
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse(); // O estado isLoading deve ser false após a resposta
  }));

  it('should hide the spinner if the file upload fails', fakeAsync(() => {
    // Simular a seleção de arquivo
    const mockFile = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const event = { target: { files: [mockFile] } } as unknown as Event;
    component.importDadosProvisionados(event);

    // Simula a requisição e resposta HTTP com falha
    const req = httpMock.expectOne('http://localhost:8080/importacao');
    expect(req.request.method).toBe('POST');

    req.flush('Erro ao enviar arquivo', { status: 500, statusText: 'Internal Server Error' });
    tick(); // Avança no tempo para que o Observable finalize
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse(); // O estado isLoading deve ser false após a falha
  }));
});
