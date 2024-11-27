import { Inject, Injectable, NgZone } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  filter,
  firstValueFrom,
  from,
  interval,
  map,
  Observable,
  Subject,
  Subscriber,
  take,
  takeUntil,
  throwError,
  timer
} from 'rxjs';
import { accumulateToBuffer, bufferUntilLast, splitLinesByDelimiter } from './rxjs-operators';
import { SERIAL_TOKEN } from './ngx-web-serial.providers.spec';

@Injectable()
export class NgxWebSerial {

  private port: SerialPort | null = null;
  private abortController: AbortController | null = null;
  private dataStream: WritableStream | null = null;
  private dataSubject: Subject<string> = new Subject<string>();
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private connectedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly connected: Observable<boolean> = this.connectedSubject.asObservable();

  private readonly sink: UnderlyingSink =  {
    write: (chunk: any) => {
      this.ngZone.run(() => {
        this.dataSubject.next(chunk);
      });
    }
  }

  constructor(
    @Inject(SERIAL_TOKEN) readonly serial: Serial | undefined,
    private ngZone: NgZone
  ) {
  }

  /**
   * Establishes a connection to a serial port using the Web Serial API.
   */
  open(serialOptions: SerialOptions = { baudRate: 9600 }, options?: SerialPortRequestOptions): Observable<void> {
    return new Observable<void>((observer: Subscriber<void>) => {
      if (!this.serial) {
        observer.error('Web serial not supported.');
        return;
      }
      this.serial.requestPort(options)
        .then((port: SerialPort) => {
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
            .pipeTo(this.dataStream, {signal: this.abortController.signal})
            .catch(() => this.closePort().catch((err) => observer.error(err)));
        })
        .catch((err) => observer.error(err))
        .finally(() => observer.complete());
    });
  }


  read(): Observable<string> {
    return this.dataSubject.asObservable();
  }

  /**
  * Writes a string to the serial port and waits for a response.
  *
  * @param data - The string to write to the serial port.
  * @param separator - The delimiter used to split the lines. Defaults to '\r\n'.
  * @returns An Observable that emits the response from the serial port
  */
  writeReadLine(data: string, separator: string = '\r\n'): Observable<string> {
    return this.write(data).pipe(
      concatMap(() => this.readLine(separator).pipe(take(1)))
    );
  }

  /**
  * Writes an array of strings to the serial port in sequential order and waiting for a
  * response after each write. The responses are emitted as an array.
  *
  * @param data - An array of strings to write to the serial port.
  * @returns An Observable that emits an array of responses from the serial port.
  */
  writeReadLines(data: string[]): Observable<string[]> {
    return from(data).pipe(
      concatMap(v => this.writeReadLine(v)),
      bufferUntilLast()
    );
  }

  /**
  * Reads lines of data from the serial port, splitting the data by the specified delimiter.
  *
  * @param separator - The delimiter used to split the lines. Defaults to '\r\n'.
  * @returns An Observable that emits the lines of data as they are read.
  */
  readLine(separator: string = '\r\n'): Observable<string> {
    return this.read().pipe(splitLinesByDelimiter(separator));
  }

  readLineBuffer(bufferSize: number = 1000, separator: string = '\r\n'): Observable<string[]> {
    return this.readLine(separator).pipe(accumulateToBuffer(bufferSize));
  }

  write(data: string): Observable<void> {
    if (this.writer) {
      return from(this.writer.write(new TextEncoder().encode(data)));

    }
    return throwError(() => new Error('No writer available.'));
  }


  private waitForReadableUnlock(period: number = 50, timeout: number = 5000): Promise<void> {
    return firstValueFrom(interval(period).pipe(
      filter(() => !this.port?.readable?.locked),
      map(() => undefined),
      takeUntil(timer(timeout)),
      catchError(() => throwError(() => new Error('Timeout waiting for readable stream to unlock')))
    ));
  }

  private closePort(): Promise<void> {
    this.abortController = null;
    if (this.writer) {
      this.writer.releaseLock();
      this.writer = null;
    }
    if (this.port) {
      return this.waitForReadableUnlock()
        .then(() => this.port!.close())
        .then(() => {
          this.port = null;
          this.connectedSubject.next(false);
        });
    } else {
      return Promise.resolve();
    }
  }
  close(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}
