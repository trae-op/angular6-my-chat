import { TestBed, async, inject } from '@angular/core/testing';

import { LoginGuard } from './login.guard';
import {LocalStorageService} from 'angular-2-local-storage';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('LoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginGuard,
        { provide: LocalStorageService }
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ]
    });
  });

  it('should ...', inject([LoginGuard], (guard: LoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
