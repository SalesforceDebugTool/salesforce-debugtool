import { TestBed } from '@angular/core/testing';

import { GetLogsService } from './get-logs.service';

describe('GetLogsService', () => {
  let service: GetLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
