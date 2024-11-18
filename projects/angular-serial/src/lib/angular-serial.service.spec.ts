import { TestBed } from '@angular/core/testing';

import { AngularSerialService } from './angular-serial.service';

describe('AngularSerialService', () => {
  let service: AngularSerialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularSerialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
