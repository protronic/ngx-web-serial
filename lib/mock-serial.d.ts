/// <reference types="w3c-web-serial" />
export declare class MockSerial {
    private readableController;
    readonly responseFunction: (input: string) => string;
    readonly readableStream: ReadableStream<Uint8Array>;
    constructor(responseFunction: (input: string) => string);
    requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
}
