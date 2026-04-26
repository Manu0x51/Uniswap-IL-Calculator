import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NumericInputProps {
    label: string;
    value: number;
    onChange: (val: number) => void;
    step?: number;
}

export const NumericInput: React.FC<NumericInputProps> = ({ label, value, onChange, step = 1 }) => {
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
