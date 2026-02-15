import { describe, it, expect } from 'vitest';
import { 
    calculateLiquidity, 
    calculateAmounts, 
    calculateImpermanentLoss 
} from './uniswapMath';

describe('Uniswap V3 Math', () => {
    describe('calculateLiquidity', () => {
        it('should calculate liquidity correctly when price is in range', () => {
            const deposit = 1000;
            const lower = 1500;
            const upper = 2500;
            const entry = 2000;
            
            const liquidity = calculateLiquidity(deposit, lower, upper, entry);
            expect(liquidity).toBeGreaterThan(0);
        });

        it('should handle price below range (all token0)', () => {
            const deposit = 1000;
            const lower = 2500;
            const upper = 3000;
            const entry = 2000;
            
            const liquidity = calculateLiquidity(deposit, lower, upper, entry);
            expect(liquidity).toBeGreaterThan(0);
        });
    });

    describe('calculateAmounts', () => {
        it('should return only amount0 if current price is below range', () => {
            const liquidity = 1000000;
            const current = 1000;
            const lower = 1500;
            const upper = 2000;
            
            const { amount0, amount1 } = calculateAmounts(liquidity, current, lower, upper);
            expect(amount0).toBeGreaterThan(0);
            expect(amount1).toEqual(0);
        });

        it('should return only amount1 if current price is above range', () => {
            const liquidity = 1000000;
            const current = 2500;
            const lower = 1500;
            const upper = 2000;
            
            const { amount0, amount1 } = calculateAmounts(liquidity, current, lower, upper);
            expect(amount0).toEqual(0);
            expect(amount1).toBeGreaterThan(0);
        });
    });

    describe('calculateImpermanentLoss', () => {
        it('should have zero IL if current price equals entry price', () => {
            const deposit = 1000;
            const lower = 1500;
            const upper = 2500;
            const entry = 2000;
            const current = 2000;

            const res = calculateImpermanentLoss(deposit, lower, upper, entry, current);
            expect(res.ilPercentage).toBeCloseTo(0, 5);
            expect(res.lpValue).toBeCloseTo(res.hodlValue, 2);
        });

        it('should calculate non-zero IL when price moves within range', () => {
            const deposit = 1000;
            const lower = 1500;
            const upper = 2500;
            const entry = 2000;
            const current = 2200;

            const res = calculateImpermanentLoss(deposit, lower, upper, entry, current);
            expect(res.ilPercentage).toBeLessThan(0);
        });
    });
});
