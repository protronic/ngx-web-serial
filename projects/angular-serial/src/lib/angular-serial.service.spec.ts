import { TestBed } from '@angular/core/testing';

import { AngularSerialService } from './angular-serial.service';
import { AngularSerialTestingModule } from './angular-serial-testing.module';
import { switchMap } from 'rxjs';

describe('AngularSerialService', () => {
  let service: AngularSerialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AngularSerialTestingModule]
    });
    service = TestBed.inject(AngularSerialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should flag service as opened', (done) => {
    service.open().subscribe(() => {
      service.isConnected().subscribe((connected) => {
        expect(connected).toBeTrue();
        done();
      });
    });
  });


  it('should echo back write value on read', (done) => {
    service.open().pipe(
      switchMap(() => service.write('test')),
      switchMap(() => service.read())
    ).subscribe((value) => {
      expect(value).toBe('test');
      service.close();
      done();
    });
  });




});
