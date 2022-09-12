import { TestBed } from '@angular/core/testing';

import { EnforcerService } from './enforcer.service';

describe('EnforcerService', () => {
  let service: EnforcerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnforcerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
