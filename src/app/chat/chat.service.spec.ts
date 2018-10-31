import { TestBed, inject } from '@angular/core/testing';

import { ChatService } from './chat.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {LocalStorageService} from 'angular-2-local-storage';

describe('ChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatService,
        { provide: LocalStorageService }
      ],
      imports: [
        HttpClientTestingModule,
        SharedModule,
        RouterTestingModule
      ]
    });
  });

  it('should be created', inject([ChatService], (service: ChatService) => {
    expect(service).toBeTruthy();
  }));
});
