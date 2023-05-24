import { fib, validEstimates } from './estimate';

describe('fib function', () => {
    it('should correctly calculate the Fibonacci sequence', () => {
        expect(fib(5)).toEqual([0, 1, 1, 2, 3, 5]);
        expect(fib(10)).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
        expect(fib(15)).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610]);
    });

    it('should return an empty array for negative input', () => {
        expect(fib(-1)).toEqual([0, 1]);
    });
});

describe('validEstimates', () => {
    it('should contain correct Fibonacci sequence up to 11 plus "?"', () => {
        const expectedSet = new Set(['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?']);
        expect(new Set(validEstimates)).toEqual(expectedSet);
    });
});
