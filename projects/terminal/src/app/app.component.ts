import { Component } from '@angular/core';
import { NgxWebSerial, provideNgxWebSerial } from '../../../ngx-web-serial/src';
import { concatMap, from, Observable, scan, switchMap, tap } from 'rxjs';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';

@Component({
    selector: 'app-root',
    imports: [AsyncPipe, NgForOf, NgIf],
    providers: [provideNgxWebSerial()],
    template: `
    <button (click)="open()" *ngIf="!(connected$ | async)">Open</button>
    <button (click)="close()" *ngIf="(connected$ | async)">Close</button>
    <button (click)="validate()" >Validate</button>
    <input #inputField
           type="text"
           (keydown.enter)="write(inputField.value); inputField.value=''"
           placeholder="Type and press Enter">
    <div *ngFor="let line of data$ | async">{{ line }}</div>
  `
})
export class AppComponent {

  data$: Observable<string[]>;
  connected$: Observable<boolean>;

  constructor(private serial: NgxWebSerial) {
    this.data$ = this.serial.readLineBuffer(10);
    this.connected$ = this.serial.connected;
  }

  open(): void {
    this.serial.open().subscribe()
  }

  close(): void {
    this.serial.close();
  }


  write(value: string): void {
    this.serial.writeReadLine(value + '\r').subscribe(v =>console.log(`${value} resulted in ${v}`));
  }

  validate(): void {
    this.serial.writeReadLines(['\r', '\r', 'MODEL\r', 'UNITS\r', 'ID\r'])
      .subscribe(v => console.log(v));

  }



}
