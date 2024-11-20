import { NgModule } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AngularSerialService } from './angular-serial.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AngularSerialService,
    {
      provide: 'Serial',
      useFactory: (document: Document) => document.defaultView?.navigator?.serial,
      deps: [DOCUMENT]
    }
  ]
})
export class AngularSerialModule { }
