import { Component } from '@angular/core';
import { AngularSerialService, provideAngularSerial, provideAngularSerialTest } from '../../../angular-serial/src';
import { Observable, scan } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  providers: [provideAngularSerialTest(i => `Hello ${i}!\n`)],
  template: `
    <button (click)="open()">Open</button>
    <input #inputField
           type="text"
           (keydown.enter)="write(inputField.value); inputField.value=''"
           placeholder="Type and press Enter">
    <div>
      <textarea [value]="data$ | async" readonly></textarea>
    </div>
  `
})
export class AppComponent {

  data$: Observable<string>;

  constructor(private serial: AngularSerialService) {
    this.data$ = this.serial.read().pipe(
      scan((acc, value) => acc + value, '')
    );
  }

  open(): void {
    this.serial.open().subscribe()
  }

  write(value: string): void {
    this.serial.write(value).subscribe();
  }

}
