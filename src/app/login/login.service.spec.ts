import { TestBed, inject } from '@angular/core/testing';

import { LoginService } from './login.service';
import {LocalStorageService} from 'angular-2-local-storage';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../shared/shared.module';

describe('LoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginService,
        { provide: LocalStorageService }
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule
      ]
    });
  });

  it('should be created', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));

});
