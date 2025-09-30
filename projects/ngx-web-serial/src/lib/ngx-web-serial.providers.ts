import { FactoryProvider, InjectionToken, Provider, DOCUMENT } from '@angular/core';

import { MockSerial } from './mock-serial';
import { NgxWebSerial } from './ngx-web-serial.service';

export const SERIAL_TOKEN = new InjectionToken<MockSerial>('Serial');

export function provideNgxWebSerial(): Provider[] {
  return [
    NgxWebSerial,
    {
      provide: SERIAL_TOKEN,
      useFactory: (document: Document) => document.defaultView?.navigator?.serial,
      deps: [DOCUMENT]
    }
  ];
}

export function provideNgxWebSerialTest(responseFunction?: (input: string) => string): Provider[] {
  return [
    NgxWebSerial,
    {
      provide: SERIAL_TOKEN,
      useFactory: () => new MockSerial(responseFunction || ((input: string) => input)),
      deps: []
    } as FactoryProvider
  ];
}
