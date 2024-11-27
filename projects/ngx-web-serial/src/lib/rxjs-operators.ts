import { filter, from, last, map, mergeMap, MonoTypeOperatorFunction, Observable, OperatorFunction, scan } from 'rxjs';

interface BufferState {
  buffer: string;
  lines: string[];
}

export function splitLinesByDelimiter(delimiter: string): MonoTypeOperatorFunction<string> {
  return (source: Observable<string>) => source.pipe(
    scan((acc: BufferState, value: string) => {
      acc.buffer += value;
      let index: number;
      while ((index = acc.buffer.indexOf(delimiter)) !== -1) {
        const line = acc.buffer.slice(0, index);
        acc.buffer = acc.buffer.slice(index + delimiter.length);
        acc.lines.push(line);
      }
      return acc;
    }, { buffer: '', lines: [] as string[] }),
    mergeMap((acc) => {
      const lines = acc.lines;
      acc.lines = [];
      return from(lines);
    })
  );
}

export function accumulateToBuffer<T>(bufferSize: number): OperatorFunction<T, T[]> {
  return (source: Observable<T>): Observable<T[]> => source.pipe(
    scan((acc: T[], value: T) => {
      acc.push(value);
      if (acc.length > bufferSize) {
        acc.shift();
      }
      return acc;
    }, []),
    filter(acc => acc.length > 0),
    map(acc => [...acc])
  );
}

export function bufferUntilLast<T>(): OperatorFunction<T, T[]> {
  return (source: Observable<T>) => source.pipe(
    scan((acc: T[], value: T) => [...acc, value], []),
    last()
  );
}
