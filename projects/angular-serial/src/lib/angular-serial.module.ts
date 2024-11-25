import { NgModule, Provider } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AngularSerialService } from './angular-serial.service';

export function provideAngularSerial(): Provider[] {
  return [
    AngularSerialService,
    {
      provide: 'Serial',
      useFactory: (document: Document) => document.defaultView?.navigator?.serial,
      deps: [DOCUMENT]
    }
  ];
}

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    provideAngularSerial()
  ]
})
export class AngularSerialModule { }
