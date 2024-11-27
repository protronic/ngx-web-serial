import { TestBed } from '@angular/core/testing';
import { NgxWebSerial } from './ngx-web-serial.service';
import { provideNgxWebSerial, provideNgxWebSerialTest, SERIAL_TOKEN } from './ngx-web-serial.providers';
import { MockSerial } from './mock-serial';


describe('NgxWebSerial Providers', () => {
  it('should provide NgxWebSerial and Serial', () => {
    TestBed.configureTestingModule({
      providers: provideNgxWebSerial()
    });

    const ngxWebSerial = TestBed.inject(NgxWebSerial);
    const serial = TestBed.inject(SERIAL_TOKEN);

    expect(ngxWebSerial).toBeInstanceOf(NgxWebSerial);
    expect(serial).toBeDefined();
  });

  it('should provide NgxWebSerial and MockSerial for testing', () => {
    TestBed.configureTestingModule({
      providers: provideNgxWebSerialTest()
    });

    const ngxWebSerial = TestBed.inject(NgxWebSerial);
    const serial = TestBed.inject(SERIAL_TOKEN);

    expect(ngxWebSerial).toBeInstanceOf(NgxWebSerial);
    expect(serial).toBeInstanceOf(MockSerial);
  });

  it('should provide MockSerial with custom response function', () => {
    const customResponseFunction = (input: string) => `response to ${input}`;

    TestBed.configureTestingModule({
      providers: provideNgxWebSerialTest(customResponseFunction)
    });

    const serial = TestBed.inject(SERIAL_TOKEN) as MockSerial;

    expect(serial).toBeInstanceOf(MockSerial);
    expect(serial.responseFunction('test')).toBe('response to test');
  });
});
