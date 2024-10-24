import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;

  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
    
  })
    .compileComponents();
  });

  
  afterEach(() => {
    httpTestingController.verify();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  it('deve inicializar o formulário corretamente', () => {
    component.createForm();

    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('devera chamar o evento de login e fazer uma requisicao HTTP', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
  
    component.onSubmit();
  
    tick(2000);
  
    const req = httpTestingController.expectOne('URL_DA_API_DE_LOGIN');
    expect(req).toBeTruthy(); 
  
    expect(req.request.method).toBe('POST');
  }));
  


});
