import { TestBed, async, inject } from '@angular/core/testing';

import { UsersGuard } from './users.guard';
import {LocalStorageService} from 'angular-2-local-storage';
import {RouterTestingModule} from '@angular/router/testing';

describe('UsersGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersGuard,
        { provide: LocalStorageService }
      ],
      imports: [
        RouterTestingModule
      ]
    });
  });

  it('should ...', inject([UsersGuard], (guard: UsersGuard) => {
    expect(guard).toBeTruthy();
  }));
});
