import { TestBed } from '@angular/core/testing';

import { DownloadLogsService } from './download-logs.service';

describe('DownloadLogsService', () => {
  let service: DownloadLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
