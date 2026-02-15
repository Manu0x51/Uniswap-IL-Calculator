// Utility functions for Uniswap v3 math

export interface PositionState {
    depositAmount: number;
    entryPrice: number;
    minPrice: number;
    maxPrice: number;
    currentPrice: number; // For simulation/current interaction
}

/**
 * Calculates Liquidity (L) based on the deposit value and entry price.
 * Formula provided by user.
 */
export const calculateLiquidity = (
    deposit: number,
    lower: number,
    upper: number,
    entry: number
): number => {
    if (entry < lower) {
        // Case 1: Entry Price < Lower Bound (All Token0)
        const term = entry * (1 / Math.sqrt(lower) - 1 / Math.sqrt(upper));
        return deposit / term;
    } else if (entry > upper) {
        // Case 2: Entry Price > Upper Bound (All Token1)
        const term = Math.sqrt(upper) - Math.sqrt(lower);
        return deposit / term;
    } else {
        // Case 3: In Range (Mix of Token0 and Token1)
        const term1 = entry * (1 / Math.sqrt(entry) - 1 / Math.sqrt(upper));
        const term2 = Math.sqrt(entry) - Math.sqrt(lower);
        return deposit / (term1 + term2);
    }
};

/**
 * Calculates the amount of Token0 and Token1 held by the position at a specific price.
 */
export const calculateAmounts = (
    liquidity: number,
    currentPrice: number,
    lower: number,
    upper: number
): { amount0: number; amount1: number } => {
    let amount0 = 0;
    let amount1 = 0;

    // Use currentPrice to determine where we are relative to the range
    // However, the formulas for amounts depend on the active range relative to price.

    if (currentPrice < lower) {
        // Price is below range -> Position is all Token0
        // "Active" range for x is [lower, upper] effectively? 
        // Wait, if P < P_min, the position holds the max amount of x it would need to cover the range [lower, upper].
        amount0 = liquidity * (1 / Math.sqrt(lower) - 1 / Math.sqrt(upper));
        amount1 = 0;
    } else if (currentPrice > upper) {
        // Price is above range -> Position is all Token1
        amount0 = 0;
        amount1 = liquidity * (Math.sqrt(upper) - Math.sqrt(lower));
    } else {
        // Price is in range
        amount0 = liquidity * (1 / Math.sqrt(currentPrice) - 1 / Math.sqrt(upper));
        amount1 = liquidity * (Math.sqrt(currentPrice) - Math.sqrt(lower));
    }

    return { amount0, amount1 };
};

/**
 * Calculates Position Value in terms of Quote Asset (USD).
 * Value = amount0 * price + amount1
 */
export const calculatePositionValue = (
    amount0: number,
    amount1: number,
    price: number
): number => {
    return amount0 * price + amount1;
};

/**
 * Calculates Hypothetical HODL Value.
 * If I just held the original assets I started with, what would they be worth now?
 * Formula: 
 * 1. Calculate original amounts (x0, y0) at entryPrice.
 * 2. HODL Value = x0 * currentPrice + y0.
 */
export const calculateHODLValue = (
    deposit: number,
    entryPrice: number,
    currentPrice: number,
    lower: number,
    upper: number
): number => {
    // 1. Calculate initial Liquidity L_initial
    const L = calculateLiquidity(deposit, lower, upper, entryPrice);

    // 2. Calculate initial amounts at entryPrice
    const { amount0: initialAmount0, amount1: initialAmount1 } = calculateAmounts(L, entryPrice, lower, upper);

    // 3. Value at currentPrice
    return initialAmount0 * currentPrice + initialAmount1;
};

/**
 * Calculates Impermanent Loss and its percentage.
 */
export const calculateImpermanentLoss = (
    deposit: number,
    lower: number,
    upper: number,
    entry: number,
    current: number
): { ilValue: number; ilPercentage: number; lpValue: number; hodlValue: number } => {
    // Prevent division by zero or invalid ranges
    if (lower >= upper || deposit <= 0 || entry <= 0 || current <= 0) {
        return { ilValue: 0, ilPercentage: 0, lpValue: 0, hodlValue: 0 };
    }

    const hodlValue = calculateHODLValue(deposit, entry, current, lower, upper);

    const L = calculateLiquidity(deposit, lower, upper, entry);
    const { amount0, amount1 } = calculateAmounts(L, current, lower, upper);
    const lpValue = calculatePositionValue(amount0, amount1, current);

    const ilValue = lpValue - hodlValue;
    // Avoid division by zero
    const ilPercentage = hodlValue !== 0 ? (ilValue / hodlValue) * 100 : 0;

    return { ilValue, ilPercentage, lpValue, hodlValue };
};
