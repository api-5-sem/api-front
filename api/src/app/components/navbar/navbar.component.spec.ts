import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let httpMock: HttpTestingController;
  let debugElement: DebugElement;
  let mockElementRef: ElementRef;
  let mockRouter: any;
  let mockLocation: any;

  beforeEach(async () => {
    mockRouter = {
      events: of(new NavigationEnd(0, 'http://localhost:4200/', 'http://localhost:4200/'))
    };

    mockLocation = {
      prepareExternalUrl: jasmine.createSpy('prepareExternalUrl').and.callFake((path) => path),
      path: jasmine.createSpy('path').and.returnValue('/dashboard')
    };

    mockElementRef = {
      nativeElement: {
        getElementsByClassName: jasmine.createSpy('getElementsByClassName').and.returnValue([{
          classList: {
            add: jasmine.createSpy('add'),
            remove: jasmine.createSpy('remove')
          }
        }])
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,  // Módulo de teste para navegação de rotas
        HttpClientTestingModule  // Módulo de teste para HttpClient
      ],
      declarations: [NavbarComponent],
      providers: [
        { provide: ElementRef, useValue: mockElementRef },
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation }
      ]
    }).compileComponents();
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
    spyOn(component, 'triggerFileInput').and.callThrough();
    
    const button = debugElement.query(By.css('button.upload-btn')).nativeElement;
    button.click();
    
    expect(component.triggerFileInput).toHaveBeenCalled();
  });

  it('deve enviar o arquivo corretamente via HTTP', () => {
    const mockFile = new File(['mock content'], 'mockFile.txt', { type: 'text/plain' });
    const mockEvent = { target: { files: [mockFile] } };

    component.importDadosProvisionados(mockEvent);

    const req = httpMock.expectOne('http://localhost:8080/importacao');
    expect(req.request.method).toBe('POST');

    req.flush({ success: true });

    expect(component.isLoading).toBeFalse();
  });

  it('deve lidar com erro ao enviar o arquivo', () => {
    const mockFile = new File(['mock content'], 'mockFile.txt', { type: 'text/plain' });
    const mockEvent = { target: { files: [mockFile] } };

    component.importDadosProvisionados(mockEvent);

    const req = httpMock.expectOne('http://localhost:8080/importacao');
    expect(req.request.method).toBe('POST');

    req.flush({ message: 'Erro no upload' }, { status: 500, statusText: 'Server Error' });

    expect(component.isLoading).toBeFalse();
  });

  it('deve não fazer nada se nenhum arquivo for selecionado', () => {
    spyOn(component, 'importDadosProvisionados').and.callThrough();

    const mockEvent = { target: { files: [] } };

    component.importDadosProvisionados(mockEvent);

    httpMock.expectNone('http://localhost:8080/importacao');
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize correctly on ngOnInit', () => {
    component.ngOnInit();
    expect(component['listTitles']).toBeDefined();
  });

  it('should toggle navbar collapse', () => {
    component.isCollapsed = true;
    component.collapse();
    expect(component.isCollapsed).toBeFalse();

    component.collapse();
    expect(component.isCollapsed).toBeTrue();
  });

  it('should open sidebar correctly', () => {
    component.sidebarOpen();
    expect(document.getElementsByTagName('html')[0].classList.contains('nav-open')).toBeTrue();
    expect(component['sidebarVisible']).toBeTrue();
  });

  it('Deve  fechar  sidebar corretamente', () => {
    component.sidebarOpen();
    component.sidebarClose();
    expect(document.getElementsByTagName('html')[0].classList.contains('nav-open')).toBeFalse();
    expect(component.sidebarVisible).toBeFalse();
  });

  it('Devera desativar sidebar corretamente', () => {
    spyOn(document, 'getElementsByClassName').and.returnValue({
      length: 1,
      0: { appendChild: () => {} },
      item: (index: number) => { return null; }
    } as any);

    component.sidebarVisible = false;
    component.sidebarToggle();
    expect(component.sidebarVisible).toBeTrue();

    component.sidebarToggle();
    expect(component.sidebarVisible).toBeFalse();
  });

  it('Devera usar, trazer o titulo correto  getTitle', () => {
    component.listTitles = [
      { path: 'dashboard', title: 'Dashboard' },
      { path: 'user', title: 'User Profile' }
    ];

    spyOn(component, 'getTitle').and.callThrough();
    const title = component.getTitle();
    expect(title).toBe('Dashboard');
  });
});
