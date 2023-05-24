// Calculate Fibonacci sequence up to a given number
export const fib = (n: number): number[] => {
    const fibSequence = [0, 1];
    for (let i = 2; i <= n; i++) {
        fibSequence.push(fibSequence[i - 1] + fibSequence[i - 2]);
    }
    return fibSequence;
};

export const fibonacciSequenceForCards = [...new Set(fib(11).map(n => n.toString()))];

// Define valid estimates
export const validEstimates = [...fibonacciSequenceForCards, '?'];
