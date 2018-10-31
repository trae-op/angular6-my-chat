import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {LocalStorageService} from 'angular-2-local-storage';
import {SharedModule} from '../shared/shared.module';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: LocalStorageService }
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
