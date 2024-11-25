import { FactoryProvider, Provider } from '@angular/core';
import { AngularSerialService } from './angular-serial.service';
import { MockSerial } from './mock-serial';

export function provideAngularSerialTest(responseFunction?: (input: string) => string): Provider[] {
  return [
    AngularSerialService,
    {
      provide: 'Serial',
      useFactory: () => new MockSerial(responseFunction || ((input: string) => input)),
      deps: []
    } as FactoryProvider
  ];
}

