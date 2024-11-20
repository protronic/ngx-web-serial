import { NgModule } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AngularSerialService } from './angular-serial.service';
import { MockSerial } from './mock-serial';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AngularSerialService,
    {
      provide: 'Serial',
      useClass: MockSerial
    }
  ]
})
export class AngularSerialTestingModule { }
