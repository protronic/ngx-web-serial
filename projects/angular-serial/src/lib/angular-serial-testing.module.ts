import { FactoryProvider, InjectionToken, NgModule, Provider } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AngularSerialService } from './angular-serial.service';
import { MockSerial } from './mock-serial';


export const RESPONSE_FUNCTION = new InjectionToken<(input: string) => string>('RESPONSE_FUNCTION');

export function provideAngularSerialTest(responseFunction?: (input: string) => string): Provider[] {
  return [
    AngularSerialService,
    {
      provide: 'Serial',
      useFactory: (responseFunction: (input: string) => string) => new MockSerial(responseFunction || ((input: string) => input)),
      deps: [RESPONSE_FUNCTION]
    } as FactoryProvider,
    { provide: RESPONSE_FUNCTION, useValue: responseFunction || ((input: string) => input) }
  ];
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    provideAngularSerialTest()
  ]
})
export class AngularSerialTestingModule {
  static forRoot(responseFunction?: (input: string) => string) {
    return {
      ngModule: AngularSerialTestingModule,
      providers: [
        { provide: RESPONSE_FUNCTION, useValue: responseFunction || ((input: string) => input) }
      ]
    };
  }
}
