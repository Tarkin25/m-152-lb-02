export {};

declare global {
    interface Window {
        minDifference: number | undefined;
        difference: number;
    }
}