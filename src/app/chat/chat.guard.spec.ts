import { TestBed, async, inject } from '@angular/core/testing';

import { ChatGuard } from './chat.guard';
import {LocalStorageService} from 'angular-2-local-storage';
import {RouterTestingModule} from '@angular/router/testing';

describe('ChatGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatGuard,
        { provide: LocalStorageService }
      ],
      imports: [
        RouterTestingModule
      ]
    });
  });

  it('should ...', inject([ChatGuard], (guard: ChatGuard) => {
    expect(guard).toBeTruthy();
  }));
});
