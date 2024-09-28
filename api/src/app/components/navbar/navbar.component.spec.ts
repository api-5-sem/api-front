import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let httpMock: HttpTestingController;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,  // Módulo de teste para o roteador
        HttpClientTestingModule  // Módulo de teste para HttpClient
      ],
      declarations: [ NavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();  // Dispara a detecção de mudanças
  });

  afterEach(() => {
    // Garante que nenhuma requisição HTTP está pendente
    httpMock.verify();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve disparar o input de arquivo ao clicar no botão', () => {
    // Cria um espião para a função triggerFileInput
    spyOn(component, 'triggerFileInput').and.callThrough();
    
    // Simula o clique no botão de upload (troque o seletor de acordo com o HTML real)
    const button = debugElement.query(By.css('button.upload-btn')).nativeElement;
    button.click();
    
    // Verifica se a função triggerFileInput foi chamada
    expect(component.triggerFileInput).toHaveBeenCalled();
  });

  it('deve enviar o arquivo corretamente via HTTP', () => {
    // Simula a seleção de um arquivo
    const mockFile = new File(['mock content'], 'mockFile.txt', { type: 'text/plain' });
    const mockEvent = { target: { files: [mockFile] } };

    // Chama a função de upload
    component.importDadosProvisionados(mockEvent);

    // Verifica se a requisição HTTP foi feita corretamente
    const req = httpMock.expectOne('http://localhost:8080/importacao');
    expect(req.request.method).toBe('POST');

    // Simula uma resposta de sucesso do servidor
    req.flush({ success: true });

    // Verifica se o indicador de carregamento foi desativado após o upload
    expect(component.isLoading).toBeFalse();
  });

  it('deve lidar com erro ao enviar o arquivo', () => {
    // Simula a seleção de um arquivo
    const mockFile = new File(['mock content'], 'mockFile.txt', { type: 'text/plain' });
    const mockEvent = { target: { files: [mockFile] } };

    // Chama a função de upload
    component.importDadosProvisionados(mockEvent);

    // Verifica se a requisição HTTP foi feita corretamente
    const req = httpMock.expectOne('http://localhost:8080/importacao');
    expect(req.request.method).toBe('POST');

    // Simula uma resposta de erro do servidor
    req.flush({ message: 'Erro no upload' }, { status: 500, statusText: 'Server Error' });

    // Verifica se o indicador de carregamento foi desativado após o erro
    expect(component.isLoading).toBeFalse();
  });

  it('deve não fazer nada se nenhum arquivo for selecionado', () => {
    spyOn(component, 'importDadosProvisionados').and.callThrough();

    // Simula o evento sem arquivo
    const mockEvent = { target: { files: [] } };

    // Chama a função
    component.importDadosProvisionados(mockEvent);

    // Espera que a função não realize nenhum upload
    httpMock.expectNone('http://localhost:8080/importacao');
    expect(component.isLoading).toBeFalse();
  });
});