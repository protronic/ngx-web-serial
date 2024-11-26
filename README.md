[![Publish to GitHub Packages](https://github.com/mattfors/ngx-web-serial/actions/workflows/build.yml/badge.svg)](https://github.com/mattfors/ngx-web-serial/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/mattfors/ngx-web-serial/branch/main/graph/badge.svg?token=GRL2B8OCW5)](https://codecov.io/gh/mattfors/ngx-web-serial)

# NgxWebSerial

NgxWebSerial is an angular library for connecting to serial devices with the Web Serial API and RxJS.

Connecting, transmitting and receiving data are abstracted to RxJS observables which will be familiar to anyone using Angular.

## Installation

```shell
npm i ngx-web-serial 
```

## Usage
Below demonstrates the basic usage. A pipe is used to accumulate the raw data from the serial port.
```typescript
import { Component } from '@angular/core';
import { NgxWebSerial, provideNgxWebSerial } from 'ngx-web-serial';
import { Observable, scan } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  providers: [provideNgxWebSerial()],
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

  constructor(private serial: NgxWebSerial) {
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

```

## Mock serial device
The module can be used with a mock serial device for testing or if you do not have a real serial device. Provide a function which takes and returns a string. In this example, the text transmitted to the serial device will be echoed back with 'Hello'.
```typescript
providers: [provideNgxWebSerialTest(i => `Hello ${i}!\n`)]
```
