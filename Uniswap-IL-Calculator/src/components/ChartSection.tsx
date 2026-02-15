import React, { useMemo } from 'react';
import { Maximize2 } from 'lucide-react';
import type { PositionState } from '../utils/uniswapMath';
import { calculateImpermanentLoss } from '../utils/uniswapMath';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    ReferenceDot
} from 'recharts';

interface ChartSectionProps {
    state: PositionState;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ state }) => {
    const data = useMemo(() => {
        const points = [];
        const steps = 200;
        const lowerBound = Math.min(state.minPrice * 0.5, state.currentPrice * 0.5);
        const upperBound = Math.max(state.maxPrice * 1.5, state.currentPrice * 1.5);
        const stepSize = (upperBound - lowerBound) / steps;

        for (let i = 0; i <= steps; i++) {
            const p = lowerBound + i * stepSize;
            const res = calculateImpermanentLoss(
                state.depositAmount,
                state.minPrice,
                state.maxPrice,
                state.entryPrice,
                p
            );
            points.push({
                price: p,
                lpValue: res.lpValue,
                hodlValue: res.hodlValue,
                il: res.ilValue
            });
        }
        return points;
    }, [state.depositAmount, state.minPrice, state.maxPrice, state.entryPrice, state.currentPrice]);

    const currentStatus = calculateImpermanentLoss(
        state.depositAmount,
        state.minPrice,
        state.maxPrice,
        state.entryPrice,
        state.currentPrice
    );

    const CustomReferenceLabel = (props: any) => {
        const { viewBox, value, fill } = props;
        const x = viewBox.x;
        const y = viewBox.height - 10;
        return (
            <g>
                <rect x={x - 40} y={y - 15} width="80" height="24" rx="4" fill="#0b0e14" stroke={fill} strokeWidth="1" />
                <text x={x} y={y} textAnchor="middle" fill={fill} fontSize="10" fontWeight="bold" dy={1}>{value}</text>
            </g>
        )
    };

    const isInRange = state.currentPrice >= state.minPrice && state.currentPrice <= state.maxPrice;

    return (
        <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden">
            {/* Chart Header Tools */}
            <div className="flex justify-end items-center mb-4 z-10">
                <button className={`p-2 hover:bg-white/5 rounded transition-colors ${isInRange ? 'text-[var(--in-range-color)]' : 'text-[var(--out-range-color)]'}`}>
                    <Maximize2 size={16} />
                </button>
            </div>

            <div className="flex-1 w-full min-h-[400px] z-10 relative">
                {(!data || data.every(d => d.lpValue === 0 && d.hodlValue === 0)) && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50 backdrop-blur-sm rounded-xl">
                        <div className="text-center">
                            <p className="text-[var(--text-secondary)] mb-2">Chart Unavailable</p>
                            <p className="text-sm text-[var(--accent-color)]">Please enter valid Deposit Amount and Range.</p>
                        </div>
                    </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <defs>
                            <linearGradient id="colorLp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={true} horizontal={true} />
                        <XAxis
                            dataKey="price"
                            stroke="#475569"
                            tickFormatter={(val) => `${val.toFixed(0)}`}
                            tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#475569"
                            tickFormatter={(val) => `$${val.toFixed(0)}`}
                            tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(11, 14, 20, 0.95)',
                                borderColor: 'var(--card-border)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            labelStyle={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px', fontFamily: 'monospace' }}
                            formatter={(value: number | undefined) => [value ? `$${value.toFixed(2)}` : '$0.00', '']}
                        />

                        {/* HODL Line (Yellow/Gold) */}
                        <Area
                            type="monotone"
                            dataKey="hodlValue"
                            stroke="var(--accent-color)"
                            strokeWidth={2}
                            fillOpacity={0}
                            fill="transparent"
                            name="HODL Value"
                        />

                        {/* LP Line (Cyan/Blue) */}
                        <Area
                            type="monotone"
                            dataKey="lpValue"
                            stroke="var(--primary-color)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorLp)"
                            name="LP Value"
                        />

                        {/* Ranges: Min & Max */}
                        <ReferenceLine
                            x={state.minPrice}
                            stroke="var(--accent-color)"
                            strokeDasharray="4 4"
                            label={<CustomReferenceLabel value={`MIN $${state.minPrice}`} fill="#fbbf24" />}
                        />
                        <ReferenceLine
                            x={state.maxPrice}
                            stroke="var(--accent-color)"
                            strokeDasharray="4 4"
                            label={<CustomReferenceLabel value={`MAX $${state.maxPrice}`} fill="#fbbf24" />}
                        />

                        {/* Deposit Price (Entry) */}
                        <ReferenceLine
                            x={state.entryPrice}
                            stroke="#fff"
                            strokeDasharray="3 3"
                            label={<CustomReferenceLabel value={`DEPOSIT $${state.entryPrice}`} fill="#fff" />}
                        />

                        {/* Current Position Dot and Label */}
                        <ReferenceDot
                            x={state.currentPrice}
                            y={currentStatus.lpValue}
                            r={6}
                            fill="#0b0e14"
                            stroke={isInRange ? 'var(--in-range-color)' : 'var(--out-range-color)'}
                            strokeWidth={3}
                        />
                        <ReferenceLine
                            x={state.currentPrice}
                            stroke="transparent"
                            label={<CustomReferenceLabel value={`CURRENT $${state.currentPrice}`} fill={isInRange ? 'var(--in-range-color)' : 'var(--out-range-color)'} />}
                        />

                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
