import { TestBed } from '@angular/core/testing';

import { PrivateMessagesService } from './private-messages.service';

describe('PrivateMessagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrivateMessagesService = TestBed.get(PrivateMessagesService);
    expect(service).toBeTruthy();
  });
});
