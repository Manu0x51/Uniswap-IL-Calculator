import React from 'react';
import type { PositionState } from '../utils/uniswapMath';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InputSectionProps {
    values: PositionState;
    onChange: (key: keyof PositionState, value: number) => void;
}

const NumericInput: React.FC<{
    label: string,
    value: number,
    onChange: (val: number) => void,
    step?: number
}> = ({ label, value, onChange, step = 1 }) => {
    const increment = () => onChange(value + step);
    const decrement = () => onChange(Math.max(0, value - step));

    return (
        <div className="space-y-2">
            <label className="block text-sm text-slate-400 mb-2 font-bold uppercase tracking-wider">
                {label}
            </label>
            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 text-white text-lg rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold font-mono transition-all"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={increment}
                        className="h-5 w-5 text-slate-300 hover:text-white"
                    >
                        <ChevronUp size={14} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={decrement}
                        className="h-5 w-5 text-slate-300 hover:text-white"
                    >
                        <ChevronDown size={14} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const InputSection: React.FC<InputSectionProps> = ({ values, onChange }) => {
    const handleFieldChange = (key: keyof PositionState) => (val: number) => {
        onChange(key, val);
    };

    const applyPreset = (percent: number) => {
        onChange('minPrice', values.entryPrice * (1 - percent));
        onChange('maxPrice', values.entryPrice * (1 + percent));
    };

    return (
        <div className="flex flex-col gap-3 h-full max-w-sm mx-auto w-full">
            <Card className="rounded-2xl shadow-2xl bg-slate-900 border border-slate-700 overflow-hidden relative">
                {/* Subtle purple gradient background for Position section */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#818cf8] blur-[80px] opacity-10 pointer-events-none"></div>

                <CardContent className="p-6 space-y-6 z-10 relative">
                    <div className="space-y-4">
                        <NumericInput
                            label="Deposit Value"
                            value={values.depositAmount}
                            onChange={handleFieldChange('depositAmount')}
                            step={100}
                        />

                        <NumericInput
                            label="Entry Price"
                            value={values.entryPrice}
                            onChange={handleFieldChange('entryPrice')}
                            step={10}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <NumericInput
                                label="Min Price"
                                value={values.minPrice}
                                onChange={handleFieldChange('minPrice')}
                                step={10}
                            />
                            <NumericInput
                                label="Max Price"
                                value={values.maxPrice}
                                onChange={handleFieldChange('maxPrice')}
                                step={10}
                            />
                        </div>

                        {/* Range Presets */}
                        <div className="grid grid-cols-3 gap-2 pt-2">
                            {[0.10, 0.30, 0.50].map(pct => (
                                <Button
                                    key={pct}
                                    variant="outline"
                                    onClick={() => applyPreset(pct)}
                                    className="py-2 h-auto rounded-lg bg-[#1e2330] border border-[#818cf8]/20 text-[#818cf8] text-[10px] font-bold hover:bg-[#818cf8]/10 hover:border-[#818cf8]/40 transition-all active:scale-95"
                                >
                                    ±{(pct * 100).toFixed(0)}%
                                </Button>
                            ))}
                        </div>

                        {/* Simulate Section */}
                        <div className="pt-4 border-t border-slate-700">
                            <div className="flex items-center gap-2 text-[#fbbf24] font-bold text-[10px] uppercase mb-4 tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]"></div>
                                Simulate Price
                            </div>

                            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4 flex flex-col gap-4">
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={values.currentPrice}
                                        onChange={(e) => onChange('currentPrice', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-bold font-mono focus:ring-2 focus:ring-[#fbbf24]/50 outline-none transition-all shadow-sm"
                                    />
                                    <div className="mt-4 px-1">
                                        <input
                                            type="range"
                                            min={values.minPrice * 0.5}
                                            max={values.maxPrice * 1.5}
                                            step={values.entryPrice / 100}
                                            value={values.currentPrice}
                                            onChange={(e) => onChange('currentPrice', parseFloat(e.target.value) || 0)}
                                            className="w-full accent-[#fbbf24] h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#fbbf24] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_12px_#fbbf24] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <Button variant="ghost" onClick={() => onChange('currentPrice', values.minPrice)} className="h-7 text-[#fbbf24] text-[10px] bg-[#fbbf24]/5 hover:bg-[#fbbf24]/10">MIN</Button>
                                    <Button variant="ghost" onClick={() => onChange('currentPrice', values.entryPrice)} className="h-7 text-slate-400 text-[10px] bg-slate-900 hover:text-white">RESET</Button>
                                    <Button variant="ghost" onClick={() => onChange('currentPrice', values.maxPrice)} className="h-7 text-[#fbbf24] text-[10px] bg-[#fbbf24]/5 hover:bg-[#fbbf24]/10">MAX</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
