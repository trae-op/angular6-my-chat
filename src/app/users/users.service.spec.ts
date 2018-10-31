import { TestBed, inject } from '@angular/core/testing';

import { UsersService } from './users.service';
import {LocalStorageService} from 'angular-2-local-storage';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../shared/shared.module';

describe('UsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersService,
        { provide: LocalStorageService }
      ],
      imports: [
        HttpClientTestingModule,
        SharedModule
      ]
    });
  });

  it('should be created', inject([UsersService], (service: UsersService) => {
    expect(service).toBeTruthy();
  }));
});
