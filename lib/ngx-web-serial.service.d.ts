/// <reference types="w3c-web-serial" />
import { NgZone, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class NgxWebSerial {
    readonly serial: Serial | undefined;
    private ngZone;
    private port;
    private abortController;
    private dataStream;
    private dataSubject;
    private writer;
    private connectedSubject;
    private readonly sink;
    constructor(serial: Serial | undefined, ngZone: NgZone);
    /**
     * Establishes a connection to a serial port using the Web Serial API.
     */
    open(serialOptions?: SerialOptions, options?: SerialPortRequestOptions): Observable<void>;
    isConnected(): Observable<boolean>;
    read(): Observable<string>;
    write(data: string): Observable<void>;
    private waitForReadableUnlock;
    private closePort;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxWebSerial, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxWebSerial>;
}
export declare function provideNgxWebSerial(): Provider[];
export declare function provideNgxWebSerialTest(responseFunction?: (input: string) => string): Provider[];
