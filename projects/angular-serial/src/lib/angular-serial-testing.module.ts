import { FactoryProvider, InjectionToken, NgModule } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AngularSerialService } from './angular-serial.service';
import { MockSerial } from './mock-serial';


export const RESPONSE_FUNCTION = new InjectionToken<(input: string) => string>('RESPONSE_FUNCTION');

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AngularSerialService,
    {
      provide: 'Serial',
      useFactory: (responseFunction: (input: string) => string) => new MockSerial(responseFunction || ((input: string) => input)),
      deps: [RESPONSE_FUNCTION]
    } as FactoryProvider
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
