import { TestBed } from '@angular/core/testing';

import { SFAPIService } from './sf-api.service';

describe('SFAPIService', () => {
  let service: SFAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SFAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
