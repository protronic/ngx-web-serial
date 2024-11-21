import { RESPONSE_FUNCTION } from './angular-serial-testing.module';
import { Inject } from '@angular/core';

export class MockSerial {
  private readableController: ReadableStreamDefaultController<Uint8Array> | null = null;
  readonly responseFunction: (input: string) => string;
  private readableStream: ReadableStream<Uint8Array>;
  constructor(@Inject(RESPONSE_FUNCTION) responseFunction: (input: string) => string) {
    this.responseFunction = responseFunction;
    this.readableStream = new ReadableStream({
      start: (controller) => {
        this.readableController = controller;
      },
      cancel: () => {
        this.readableController = null;
      }
    });
  }

  requestPort(options?: SerialPortRequestOptions): Promise<SerialPort> {
    return Promise.resolve({
      open: () => Promise.resolve(),
      close: () => this.readableStream.cancel(),
      readable: this.readableStream,
      writable: new WritableStream({
        write: (chunk) => {
          const input = new TextDecoder().decode(chunk);
          const response = this.responseFunction(input);
          if (this.readableController) {
            this.readableController.enqueue(new TextEncoder().encode(response));
          }
        }
      })
    } as any as SerialPort);
  }
}
