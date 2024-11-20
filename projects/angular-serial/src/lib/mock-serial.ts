export class MockSerial {
  private readableController: ReadableStreamDefaultController<Uint8Array> | null = null;

  requestPort(options?: SerialPortRequestOptions): Promise<SerialPort> {
    return Promise.resolve({
      open: () => Promise.resolve(),
      close: () => Promise.resolve(),
      readable: new ReadableStream({
        start: (controller) => {
          this.readableController = controller;
        }
      }),
      writable: new WritableStream({
        write: (chunk) => {
          const input = new TextDecoder().decode(chunk);
          let response: string = input.trim();
          if (this.readableController) {
            this.readableController.enqueue(new TextEncoder().encode(response));
          }
        }
      })
    } as any as SerialPort);
  }
}
