import { describe, it, expect } from 'vitest';
import { calculateLiquidity, calculateAmounts, calculatePositionValue, calculateImpermanentLoss } from './uniswapMath';

describe('Uniswap Math Utils', () => {
    it('calculates liquidity correctly for price in range', () => {
        // Example: Deposit $1000, Entry 2000, Range 1500-2500
        const deposit = 1000;
        const entry = 2000;
        const lower = 1500;
        const upper = 2500;
        const L = calculateLiquidity(deposit, lower, upper, entry);
        expect(L).toBeGreaterThan(0);
    });

    it('calculates amounts correctly when price < lower', () => {
        // Price < Lower -> All Token0
        const deposit = 1000;
        const entry = 1000;
        const lower = 1500;
        const upper = 2500;
        const L = calculateLiquidity(deposit, lower, upper, entry);
        const { amount0, amount1 } = calculateAmounts(L, entry, lower, upper);
        expect(amount1).toBe(0);
        expect(amount0).toBeGreaterThan(0);
        // Value should match deposit
        const value = calculatePositionValue(amount0, amount1, entry);
        expect(value).toBeCloseTo(deposit, 1);
    });

    it('calculates amounts correctly when price > upper', () => {
        // Price > Upper -> All Token1
        const deposit = 1000;
        const entry = 3000;
        const lower = 1500;
        const upper = 2500;
        const L = calculateLiquidity(deposit, lower, upper, entry);
        const { amount0, amount1 } = calculateAmounts(L, entry, lower, upper);
        expect(amount0).toBe(0);
        expect(amount1).toBeGreaterThan(0);
        // Value should match deposit
        const value = calculatePositionValue(amount0, amount1, entry);
        expect(value).toBeCloseTo(deposit, 1);
    });

    it('calculates IL correctly', () => {
        // Scenario: 
        // Deposit $1000 at P=100. Range 50-150.
        // Price moves to 120.
        // Expect IL to be negative (loss relative to HODL).
        const deposit = 1000;
        const entry = 100;
        const lower = 50;
        const upper = 150;
        const current = 120; // Price goes up

        const { ilValue, lpValue, hodlValue } = calculateImpermanentLoss(deposit, lower, upper, entry, current);

        // HODL value should be linear projection
        // LP Value should be less than HODL (divergence loss)
        expect(lpValue).toBeLessThan(hodlValue);
        expect(ilValue).toBeLessThan(0);
    });

    it('handles zero comparisons safely', () => {
        const { ilValue } = calculateImpermanentLoss(1000, 1000, 1000, 1000, 1000);
        // Should safely return 0s or handle equality without crash
        expect(ilValue).toBe(0);
    });
});
