import { FactoryProvider, Provider } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MockSerial } from './mock-serial';
import { NgxWebSerial } from './ngx-web-serial.service';
import { SERIAL_TOKEN } from './ngx-web-serial.providers.spec';

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
