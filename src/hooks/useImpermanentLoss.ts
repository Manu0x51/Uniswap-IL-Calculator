import { useMemo } from 'react';
import type { PositionState } from '../utils/uniswapMath';
import { calculateImpermanentLoss } from '../utils/uniswapMath';

/**
 * Custom hook to calculate impermanent loss for a Uniswap v3 position.
 *
 * @param state - The position state containing deposit amount, price range, entry and current prices
 * @returns Object containing IL value, IL percentage, LP value, and HODL value
 */
export const useImpermanentLoss = (state: PositionState) => {
    const result = useMemo(() => {
        return calculateImpermanentLoss(
            state.depositAmount,
            state.minPrice,
            state.maxPrice,
            state.entryPrice,
            state.currentPrice
        );
    }, [state.depositAmount, state.minPrice, state.maxPrice, state.entryPrice, state.currentPrice]);

    return result;
};
