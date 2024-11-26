[![npm version](https://badge.fury.io/js/angular-web-serial.svg?icon=si%3Anpm)](https://badge.fury.io/js/angular-web-serial)
[![Publish to GitHub Packages](https://github.com/mattfors/ngx-web-serial/actions/workflows/build.yml/badge.svg)](https://github.com/mattfors/ngx-web-serial/actions/workflows/build.yml)
[![codecov](https://codecov.io/github/mattfors/ngx-web-serial/graph/badge.svg?token=GRL2B8OCW5)](https://codecov.io/github/mattfors/ngx-web-serial)

# NGX Web Serial

Angular Web Serial is an angular module for connecting to serial devices with the Web Serial API.

## Installation

```shell
npm i angular-web-serial 
```

## Usage
Below is the basic usage of the module. A pipe is used to accumulate the raw data from the serial port. 
```typescript
import { Component } from '@angular/core';
import { AngularSerialService, provideAngularSerial } from '../../../ngx-web-serial/src';
import { Observable, scan } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  providers: [provideAngularSerial()],
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
    this.serial.write(value + '\r').subscribe();
  }

}

```

## Mock serial device
The module can be used with a mock serial device for testing or if you do not have a real serial device. Provide a function which takes and returns a string. In this example, the text transmitted to the serial device will be echoed back with 'Hello'.  
```typescript
providers: [provideAngularSerialTest(i => `Hello ${i}!\n`)]
```
