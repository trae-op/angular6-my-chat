import { TestBed, inject } from '@angular/core/testing';

import { LoginService } from './login.service';
import {LocalStorageService} from 'angular-2-local-storage';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
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

  it('should get users', inject([LoginService, HttpTestingController],
    (service: LoginService, backend: HttpTestingController) => {
      service.login({
        email: 'tanos@gmail.com',
        password: 'tanos'
      }).subscribe(response => {
        console.log('unit response', response);
        // expect(response).toEqual({
        //   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmQzNDYzYWFmMTM1NDJjMGIwYjZiZTMiLCJuYW1lIjoidGFub3MiLCJlbWFpbCI6InRhbm9zQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJE1OVHpRd1JTdndrREZRc04vOWpWNnV0TEI4dW91UENmcXc1ci9nMTNvVjVVMS5mcmVPbENPIiwiY29uZmlybV9wYXNzd29yZCI6InRhbm9zIiwicm9sZSI6IlVzZXIiLCJjcmVhdGVkX2F0IjoiMjYuMTAuMjAxOCAxOTo1MiIsIl9fdiI6MCwiaWF0IjoxNTQxMDAwODIyLCJleHAiOjE1NDEwODcyMjJ9.uhZyliEbsgfI2RAsRCGxvlKjl9bPPetgfv9HcwDVO6E',
        //   user: {
        //     confirm_password: 'tanos',
        //     created_at: '26.10.2018 19:52',
        //     email: 'tanos@gmail.com',
        //     name: 'tanos',
        //     password: '$2b$10$MNTzQwRSvwkDFQsN/9jV6utLB8uouPCfqw5r/g13oV5U1.freOlCO',
        //     role: 'User'
        //   }
        // });
      });

      // const call: TestRequest = backend.expectOne('http://0.0.0.0:8000/api/users/login');
      // expect(call.request.method).toEqual('POST');
      // call.flush({
      //   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmQzNDYzYWFmMTM1NDJjMGIwYjZiZTMiLCJuYW1lIjoidGFub3MiLCJlbWFpbCI6InRhbm9zQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJE1OVHpRd1JTdndrREZRc04vOWpWNnV0TEI4dW91UENmcXc1ci9nMTNvVjVVMS5mcmVPbENPIiwiY29uZmlybV9wYXNzd29yZCI6InRhbm9zIiwicm9sZSI6IlVzZXIiLCJjcmVhdGVkX2F0IjoiMjYuMTAuMjAxOCAxOTo1MiIsIl9fdiI6MCwiaWF0IjoxNTQxMDAwODIyLCJleHAiOjE1NDEwODcyMjJ9.uhZyliEbsgfI2RAsRCGxvlKjl9bPPetgfv9HcwDVO6E',
      //   user: {}
      // });
      // backend.verify();
    }));
});
