// Calculate Fibonacci sequence up to a given number
export const fib = (n: number): number[] => {
    const fibSequence = [0, 1];
    for (let i = 2; i <= n; i++) {
        fibSequence.push(fibSequence[i - 1] + fibSequence[i - 2]);
    }
    return fibSequence;
};

// Define valid estimates
export const validEstimates = fib(15)
    .map(n => n.toString())
    .concat('?'); // fib(15) gives Fibonacci sequence up to 987
