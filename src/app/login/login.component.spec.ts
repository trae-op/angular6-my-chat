import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LocalStorageService} from 'angular-2-local-storage';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginService} from './login.service';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;
  let spy: jasmine.Spy;
  let mockUser;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        SharedModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        LoginService,
        { provide: LocalStorageService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = fixture.debugElement.injector.get(LoginService);
    mockUser = {user: 'Kolya'};
    spy = spyOn(loginService, 'login').and.returnValue(Observable.of(mockUser));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call LoginService', () => {
    component.send();
    expect(spy.calls.any()).toBeTruthy();
  });

  it('should set user', () => {
    component.send();
    expect(component.dataUser).toEqual(mockUser);
  });
});
