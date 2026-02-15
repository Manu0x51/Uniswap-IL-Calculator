import React, { useMemo } from 'react';
import type { PositionState } from '../utils/uniswapMath';
import { calculateImpermanentLoss } from '../utils/uniswapMath';
import { ChevronDown, Info } from 'lucide-react';

interface ResultsCardProps {
    state: PositionState;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ state }) => {
    const { ilValue, ilPercentage, lpValue, hodlValue } = useMemo(() => {
        return calculateImpermanentLoss(
            state.depositAmount,
            state.minPrice,
            state.maxPrice,
            state.entryPrice,
            state.currentPrice
        );
    }, [state]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    const formatPercent = (val: number) =>
        `${val > 0 ? '+' : ''}${val.toFixed(2)}% `;

    const pnlValue = lpValue - state.depositAmount;
    const pnlPercent = (pnlValue / state.depositAmount) * 100;

    return (
        <div className="glass-card p-5 h-full flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4 text-[var(--text-primary)] font-bold text-xs uppercase tracking-wide">
                <ChevronDown size={14} className="text-[var(--primary-color)]" />
                Position Overview
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* LP Value vs HODL */}
                <div className="bg-[#0b0e14] border border-[var(--card-border)] rounded-lg p-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--primary-color)]"></div>
                    <h3 className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold mb-1">LP Value | HODL Value</h3>
                    <div className="items-baseline gap-2">
                        <span className="text-lg font-mono font-bold text-[var(--primary-color)]">{formatCurrency(lpValue)}</span>
                        <span className="text-xs font-mono text-[var(--text-secondary)] ml-2 border-l border-[var(--card-border)] pl-2">{formatCurrency(hodlValue)}</span>
                    </div>
                </div>

                {/* PnL Card */}
                <div className="bg-[#0b0e14] border border-[var(--card-border)] rounded-lg p-3 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${pnlValue >= 0 ? 'bg-[var(--success-color)]' : 'bg-[var(--danger-color)]'}`}></div>
                    <h3 className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold mb-1">PnL vs Deposit</h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-lg font-mono font-bold ${pnlValue >= 0 ? 'text-[var(--success-color)]' : 'text-[var(--danger-color)]'}`}>
                            {formatCurrency(pnlValue)}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${pnlValue >= 0 ? 'bg-[var(--success-color)]/20 text-[var(--success-color)]' : 'bg-[var(--danger-color)]/20 text-[var(--danger-color)]'}`}>
                            {formatPercent(pnlPercent)}
                        </span>
                    </div>
                </div>

                {/* IL Card */}
                <div className="bg-[#0b0e14] border border-[var(--card-border)] rounded-lg p-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent-color)]"></div>
                    <h3 className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold mb-1">Impermanent Loss</h3>
                    <div className="flex flex-col">
                        <span className="text-lg font-mono font-bold text-[var(--accent-color)]">{ilPercentage.toFixed(2)}%</span>
                        <span className="text-[10px] text-[var(--accent-color)]/70 font-mono">${ilValue.toFixed(2)}</span>
                    </div>
                </div>

                {/* Status / Info */}
                <div className="bg-[#0b0e14] border border-[var(--card-border)] rounded-lg p-3 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${state.currentPrice >= state.minPrice && state.currentPrice <= state.maxPrice ? 'bg-[var(--in-range-color)]' : 'bg-[var(--out-range-color)]'}`}></div>
                    <h3 className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold mb-1 ml-2">Status</h3>
                    {state.currentPrice >= state.minPrice && state.currentPrice <= state.maxPrice ? (
                        <div className="flex items-center gap-2 mt-1 ml-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--in-range-color)] shadow-[0_0_8px_var(--in-range-color)] animate-pulse"></div>
                            <span className="text-sm font-bold text-[var(--in-range-color)] tracking-wide">IN RANGE</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mt-1 ml-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--out-range-color)]"></div>
                            <span className="text-sm font-bold text-[var(--out-range-color)] tracking-wide">OUT OF RANGE</span>
                        </div>
                    )}
                    <div className="flex justify-end mt-1">
                        <Info size={12} className="text-[var(--text-secondary)] hover:text-white cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
};
