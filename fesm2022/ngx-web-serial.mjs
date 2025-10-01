import * as i0 from '@angular/core';
import { Injectable, Inject } from '@angular/core';
import { Subject, BehaviorSubject, Observable, from, throwError, firstValueFrom, interval, filter, map, takeUntil, timer, catchError } from 'rxjs';
import { DOCUMENT } from '@angular/common';

class MockSerial {
    constructor(responseFunction) {
        this.readableController = null;
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
    requestPort(options) {
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
        });
    }
}

class NgxWebSerial {
    constructor(serial, ngZone) {
        this.serial = serial;
        this.ngZone = ngZone;
        this.port = null;
        this.abortController = null;
        this.dataStream = null;
        this.dataSubject = new Subject();
        this.writer = null;
        this.connectedSubject = new BehaviorSubject(false);
        this.sink = {
            write: (chunk) => {
                this.ngZone.run(() => {
                    this.dataSubject.next(chunk);
                });
            }
        };
    }
    /**
     * Establishes a connection to a serial port using the Web Serial API.
     */
    open(serialOptions = { baudRate: 9600 }, options) {
        return new Observable((observer) => {
            if (!this.serial) {
                observer.error('Web serial not supported.');
                return;
            }
            this.serial.requestPort(options)
                .then((port) => {
                this.port = port;
                return this.port.open(serialOptions);
            })
                .then(() => {
                if (!this.port?.readable || !this.port?.writable) {
                    observer.error('Port is not readable or writable.');
                    return;
                }
                this.connectedSubject.next(true);
                this.abortController = new AbortController();
                this.dataStream = new WritableStream(this.sink);
                this.writer = this.port?.writable.getWriter();
                observer.next();
                return this.port.readable
                    .pipeThrough(new TextDecoderStream())
                    .pipeTo(this.dataStream, { signal: this.abortController.signal })
                    .catch(() => this.closePort().catch((err) => observer.error(err)));
            })
                .catch((err) => observer.error(err))
                .finally(() => observer.complete());
        });
    }
    isConnected() {
        return this.connectedSubject.asObservable();
    }
    read() {
        return this.dataSubject.asObservable();
    }
    write(data) {
        if (this.writer) {
            return from(this.writer.write(new TextEncoder().encode(data)));
        }
        return throwError(() => new Error('No writer available.'));
    }
    waitForReadableUnlock(period = 50, timeout = 5000) {
        return firstValueFrom(interval(period).pipe(filter(() => !this.port?.readable?.locked), map(() => undefined), takeUntil(timer(timeout)), catchError(() => throwError(() => new Error('Timeout waiting for readable stream to unlock')))));
    }
    closePort() {
        this.abortController = null;
        if (this.writer) {
            this.writer.releaseLock();
            this.writer = null;
        }
        if (this.port) {
            return this.waitForReadableUnlock()
                .then(() => this.port.close())
                .then(() => {
                this.port = null;
                this.connectedSubject.next(false);
            });
        }
        else {
            return Promise.resolve();
        }
    }
    close() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgxWebSerial, deps: [{ token: 'Serial' }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgxWebSerial }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NgxWebSerial, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: ['Serial']
                }] }, { type: i0.NgZone }] });
function provideNgxWebSerial() {
    return [
        NgxWebSerial,
        {
            provide: 'Serial',
            useFactory: (document) => document.defaultView?.navigator?.serial,
            deps: [DOCUMENT]
        }
    ];
}
function provideNgxWebSerialTest(responseFunction) {
    return [
        NgxWebSerial,
        {
            provide: 'Serial',
            useFactory: () => new MockSerial(responseFunction || ((input) => input)),
            deps: []
        }
    ];
}

/*
 * Public API Surface of ngx-web-serial
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgxWebSerial, provideNgxWebSerial, provideNgxWebSerialTest };
//# sourceMappingURL=ngx-web-serial.mjs.map
