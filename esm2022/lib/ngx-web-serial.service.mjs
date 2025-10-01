import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, firstValueFrom, from, interval, map, Observable, Subject, takeUntil, throwError, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MockSerial } from './mock-serial';
import * as i0 from "@angular/core";
export class NgxWebSerial {
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
export function provideNgxWebSerial() {
    return [
        NgxWebSerial,
        {
            provide: 'Serial',
            useFactory: (document) => document.defaultView?.navigator?.serial,
            deps: [DOCUMENT]
        }
    ];
}
export function provideNgxWebSerialTest(responseFunction) {
    return [
        NgxWebSerial,
        {
            provide: 'Serial',
            useFactory: () => new MockSerial(responseFunction || ((input) => input)),
            deps: []
        }
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXdlYi1zZXJpYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC13ZWItc2VyaWFsL3NyYy9saWIvbmd4LXdlYi1zZXJpYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQW1CLE1BQU0sRUFBRSxVQUFVLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBQ3RGLE9BQU8sRUFDTCxlQUFlLEVBQ2YsVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsSUFBSSxFQUNKLFFBQVEsRUFDUixHQUFHLEVBQ0gsVUFBVSxFQUNWLE9BQU8sRUFFUCxTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFDTixNQUFNLE1BQU0sQ0FBQztBQUNkLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQyxNQUFNLE9BQU8sWUFBWTtJQWlCdkIsWUFDNkIsTUFBMEIsRUFDN0MsTUFBYztRQURLLFdBQU0sR0FBTixNQUFNLENBQW9CO1FBQzdDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFqQmhCLFNBQUksR0FBc0IsSUFBSSxDQUFDO1FBQy9CLG9CQUFlLEdBQTJCLElBQUksQ0FBQztRQUMvQyxlQUFVLEdBQTBCLElBQUksQ0FBQztRQUN6QyxnQkFBVyxHQUFvQixJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ3JELFdBQU0sR0FBbUQsSUFBSSxDQUFDO1FBQzlELHFCQUFnQixHQUE2QixJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztRQUV4RSxTQUFJLEdBQW9CO1lBQ3ZDLEtBQUssRUFBRSxDQUFDLEtBQVUsRUFBRSxFQUFFO2dCQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUss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SztRQUNILElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDL0IsQ0FBQztJQUNILENBQUM7K0dBeEdVLFlBQVksa0JBa0JiLFFBQVE7bUhBbEJQLFlBQVk7OzRGQUFaLFlBQVk7a0JBRHhCLFVBQVU7OzBCQW1CTixNQUFNOzJCQUFDLFFBQVE7O0FBeUZwQixNQUFNLFVBQVUsbUJBQW1CO0lBQ2pDLE9BQU87UUFDTCxZQUFZO1FBQ1o7WUFDRSxPQUFPLEVBQUUsUUFBUTtZQUNqQixVQUFVLEVBQUUsQ0FBQyxRQUFrQixFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxNQUFNO1lBQzNFLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQztTQUNqQjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLHVCQUF1QixDQUFDLGdCQUE0QztJQUNsRixPQUFPO1FBQ0wsWUFBWTtRQUNaO1lBQ0UsT0FBTyxFQUFFLFFBQVE7WUFDakIsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksVUFBVSxDQUFDLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hGLElBQUksRUFBRSxFQUFFO1NBQ1U7S0FDckIsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGYWN0b3J5UHJvdmlkZXIsIEluamVjdCwgSW5qZWN0YWJsZSwgTmdab25lLCBQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQmVoYXZpb3JTdWJqZWN0LFxuICBjYXRjaEVycm9yLFxuICBmaWx0ZXIsXG4gIGZpcnN0VmFsdWVGcm9tLFxuICBmcm9tLFxuICBpbnRlcnZhbCxcbiAgbWFwLFxuICBPYnNlcnZhYmxlLFxuICBTdWJqZWN0LFxuICBTdWJzY3JpYmVyLFxuICB0YWtlVW50aWwsXG4gIHRocm93RXJyb3IsXG4gIHRpbWVyXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTW9ja1NlcmlhbCB9IGZyb20gJy4vbW9jay1zZXJpYWwnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmd4V2ViU2VyaWFsIHtcblxuICBwcml2YXRlIHBvcnQ6IFNlcmlhbFBvcnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBhYm9ydENvbnRyb2xsZXI6IEFib3J0Q29udHJvbGxlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGRhdGFTdHJlYW06IFdyaXRhYmxlU3RyZWFtIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZGF0YVN1YmplY3Q6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgcHJpdmF0ZSB3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjxVaW50OEFycmF5PiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGNvbm5lY3RlZFN1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgc2luazogVW5kZXJseWluZ1NpbmsgPSAge1xuICAgIHdyaXRlOiAoY2h1bms6IGFueSkgPT4ge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5kYXRhU3ViamVjdC5uZXh0KGNodW5rKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoJ1NlcmlhbCcpIHJlYWRvbmx5IHNlcmlhbDogU2VyaWFsIHwgdW5kZWZpbmVkLFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gIH1cblxuICAvKipcbiAgICogRXN0YWJsaXNoZXMgYSBjb25uZWN0aW9uIHRvIGEgc2VyaWFsIHBvcnQgdXNpbmcgdGhlIFdlYiBTZXJpYWwgQVBJLlxuICAgKi9cbiAgb3BlbihzZXJpYWxPcHRpb25zOiBTZXJpYWxPcHRpb25zID0geyBiYXVkUmF0ZTogOTYwMCB9LCBvcHRpb25zPzogU2VyaWFsUG9ydFJlcXVlc3RPcHRpb25zKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPHZvaWQ+KChvYnNlcnZlcjogU3Vic2NyaWJlcjx2b2lkPikgPT4ge1xuICAgICAgaWYgKCF0aGlzLnNlcmlhbCkge1xuICAgICAgICBvYnNlcnZlci5lcnJvcignV2ViIHNlcmlhbCBub3Qgc3VwcG9ydGVkLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnNlcmlhbC5yZXF1ZXN0UG9ydChvcHRpb25zKVxuICAgICAgICAudGhlbigocG9ydDogU2VyaWFsUG9ydCkgPT4ge1xuICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQ7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucG9ydC5vcGVuKHNlcmlhbE9wdGlvbnMpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnBvcnQ/LnJlYWRhYmxlIHx8ICF0aGlzLnBvcnQ/LndyaXRhYmxlKSB7XG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcignUG9ydCBpcyBub3QgcmVhZGFibGUgb3Igd3JpdGFibGUuJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuY29ubmVjdGVkU3ViamVjdC5uZXh0KHRydWUpO1xuICAgICAgICAgIHRoaXMuYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICAgIHRoaXMuZGF0YVN0cmVhbSA9IG5ldyBXcml0YWJsZVN0cmVhbSh0aGlzLnNpbmspO1xuICAgICAgICAgIHRoaXMud3JpdGVyID0gdGhpcy5wb3J0Py53cml0YWJsZS5nZXRXcml0ZXIoKTtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucG9ydC5yZWFkYWJsZVxuICAgICAgICAgICAgLnBpcGVUaHJvdWdoKG5ldyBUZXh0RGVjb2RlclN0cmVhbSgpKVxuICAgICAgICAgICAgLnBpcGVUbyh0aGlzLmRhdGFTdHJlYW0sIHtzaWduYWw6IHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbH0pXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy5jbG9zZVBvcnQoKS5jYXRjaCgoZXJyKSA9PiBvYnNlcnZlci5lcnJvcihlcnIpKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiBvYnNlcnZlci5lcnJvcihlcnIpKVxuICAgICAgICAuZmluYWxseSgoKSA9PiBvYnNlcnZlci5jb21wbGV0ZSgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlzQ29ubmVjdGVkKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3RlZFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICByZWFkKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICB3cml0ZShkYXRhOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy53cml0ZXIpIHtcbiAgICAgIHJldHVybiBmcm9tKHRoaXMud3JpdGVyLndyaXRlKG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShkYXRhKSkpO1xuXG4gICAgfVxuICAgIHJldHVybiB0aHJvd0Vycm9yKCgpID0+IG5ldyBFcnJvcignTm8gd3JpdGVyIGF2YWlsYWJsZS4nKSk7XG4gIH1cblxuXG4gIHByaXZhdGUgd2FpdEZvclJlYWRhYmxlVW5sb2NrKHBlcmlvZDogbnVtYmVyID0gNTAsIHRpbWVvdXQ6IG51bWJlciA9IDUwMDApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gZmlyc3RWYWx1ZUZyb20oaW50ZXJ2YWwocGVyaW9kKS5waXBlKFxuICAgICAgZmlsdGVyKCgpID0+ICF0aGlzLnBvcnQ/LnJlYWRhYmxlPy5sb2NrZWQpLFxuICAgICAgbWFwKCgpID0+IHVuZGVmaW5lZCksXG4gICAgICB0YWtlVW50aWwodGltZXIodGltZW91dCkpLFxuICAgICAgY2F0Y2hFcnJvcigoKSA9PiB0aHJvd0Vycm9yKCgpID0+IG5ldyBFcnJvcignVGltZW91dCB3YWl0aW5nIGZvciByZWFkYWJsZSBzdHJlYW0gdG8gdW5sb2NrJykpKVxuICAgICkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZVBvcnQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5hYm9ydENvbnRyb2xsZXIgPSBudWxsO1xuICAgIGlmICh0aGlzLndyaXRlcikge1xuICAgICAgdGhpcy53cml0ZXIucmVsZWFzZUxvY2soKTtcbiAgICAgIHRoaXMud3JpdGVyID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMucG9ydCkge1xuICAgICAgcmV0dXJuIHRoaXMud2FpdEZvclJlYWRhYmxlVW5sb2NrKClcbiAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5wb3J0IS5jbG9zZSgpKVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5wb3J0ID0gbnVsbDtcbiAgICAgICAgICB0aGlzLmNvbm5lY3RlZFN1YmplY3QubmV4dChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICB9XG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFib3J0Q29udHJvbGxlcikge1xuICAgICAgdGhpcy5hYm9ydENvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVOZ3hXZWJTZXJpYWwoKTogUHJvdmlkZXJbXSB7XG4gIHJldHVybiBbXG4gICAgTmd4V2ViU2VyaWFsLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6ICdTZXJpYWwnLFxuICAgICAgdXNlRmFjdG9yeTogKGRvY3VtZW50OiBEb2N1bWVudCkgPT4gZG9jdW1lbnQuZGVmYXVsdFZpZXc/Lm5hdmlnYXRvcj8uc2VyaWFsLFxuICAgICAgZGVwczogW0RPQ1VNRU5UXVxuICAgIH1cbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVOZ3hXZWJTZXJpYWxUZXN0KHJlc3BvbnNlRnVuY3Rpb24/OiAoaW5wdXQ6IHN0cmluZykgPT4gc3RyaW5nKTogUHJvdmlkZXJbXSB7XG4gIHJldHVybiBbXG4gICAgTmd4V2ViU2VyaWFsLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6ICdTZXJpYWwnLFxuICAgICAgdXNlRmFjdG9yeTogKCkgPT4gbmV3IE1vY2tTZXJpYWwocmVzcG9uc2VGdW5jdGlvbiB8fCAoKGlucHV0OiBzdHJpbmcpID0+IGlucHV0KSksXG4gICAgICBkZXBzOiBbXVxuICAgIH0gYXMgRmFjdG9yeVByb3ZpZGVyXG4gIF07XG59XG4iXX0=