import { TestScheduler } from 'rxjs/testing';
import { accumulateToBuffer, bufferUntilLast, splitLinesByDelimiter } from './rxjs-operators';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

describe('RxJS Operators', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });


  it('should split lines by the given delimiter', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const sourceValues= { a: 'line1\n', b: 'line2\n', c: 'line3\nline4\n'};
      const expectedValues = { a: 'line1', b: 'line2', c: 'line3', d: 'line4' };

      const source: ColdObservable<string> = cold('-a-b-c', sourceValues);
      const expected: string  = '                          -a-b-(cd)';

      const result = source.pipe(splitLinesByDelimiter('\n'));
      expectObservable(result).toBe(expected, expectedValues);
    });
  });

  it('should accumulate values into a buffer of specified size', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source: ColdObservable<number> = cold('-a-b-c-d|', { a: 1, b: 2, c: 3, d: 4});
      const expected: string = '                           -a-b-c-d|';
      const values = {
        a: [1],
        b: [1, 2],
        c: [1, 2, 3],
        d: [2, 3, 4],
      };

      const result = source.pipe(accumulateToBuffer(3));
      expectObservable(result).toBe(expected, values);
    });
  });

  it('should buffer all values until the last one', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source: ColdObservable<number> = cold('-a-b-c-d|', { a: 1, b: 2, c: 3, d: 4 });
      const expected: string = '                           --------(x|)';
      const values = {
        x: [1, 2, 3, 4],
      };

      const result = source.pipe(bufferUntilLast());
      expectObservable(result).toBe(expected, values);
    });
  });
});
