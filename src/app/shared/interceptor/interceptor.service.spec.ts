import { TestBed, inject } from '@angular/core/testing';

import { InterceptorService } from './interceptor.service';
import {LocalStorageService} from 'angular-2-local-storage';

describe('InterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InterceptorService,
        { provide: LocalStorageService }
      ]
    });
  });

  it('should be created', inject([InterceptorService], (service: InterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
