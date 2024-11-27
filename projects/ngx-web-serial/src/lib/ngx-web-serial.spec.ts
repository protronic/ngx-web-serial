import { TestBed } from '@angular/core/testing';

import { NgxWebSerial } from './ngx-web-serial.service';
import { switchMap } from 'rxjs';
import { provideNgxWebSerialTest } from './ngx-web-serial.providers';
import { SERIAL_TOKEN } from './ngx-web-serial.providers';



describe('AngularSerialService', () => {
  let service: NgxWebSerial;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNgxWebSerialTest(v => v)]
    });
    service = TestBed.inject(NgxWebSerial);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should flag service as opened', (done) => {
    service.open().subscribe(() => {
      service.connected.subscribe((connected) => {
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

  it('should handle undefined Serial', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideNgxWebSerialTest(v => v),
        { provide: SERIAL_TOKEN, useValue: undefined }
      ]
    });
    service = TestBed.inject(NgxWebSerial);
    service.open().subscribe({
      error: (err) => {
        expect(err).toBe('Web serial not supported.');
      }
    });
  });

  it('should handle non-writable port', (done) => {
    const mockSerialPort = {
      open: () => Promise.resolve(),
      close: () => Promise.resolve(),
      readable: new ReadableStream(),
      writable: null
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideNgxWebSerialTest(v => v),
        { provide: SERIAL_TOKEN, useValue: { requestPort: () => Promise.resolve(mockSerialPort) } }
      ]
    });
    service = TestBed.inject(NgxWebSerial);
    service.open().subscribe({
      error: (err) => {
        expect(err).toBe('Port is not readable or writable.');
        done();
      }
    });
  });

  it('should handle non-readable and non-writable port', (done) => {
    const mockSerialPort = {
      open: () => Promise.resolve(),
      close: () => Promise.resolve(),
      readable: null,
      writable: null
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideNgxWebSerialTest(v => v),
        { provide: SERIAL_TOKEN, useValue: { requestPort: () => Promise.resolve(mockSerialPort) } }
      ]
    });
    service = TestBed.inject(NgxWebSerial);
    service.open().subscribe({
      error: (err) => {
        expect(err).toBe('Port is not readable or writable.');
        done();
      }
    });
  });


});
