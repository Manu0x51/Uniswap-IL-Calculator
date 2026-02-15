import { useState } from 'react';
import './index.css';
import type { PositionState } from './utils/uniswapMath';
import { InputSection } from './components/InputSection';
import { ResultsCard } from './components/ResultsCard';
import { ChartSection } from './components/ChartSection';
import { LayoutDashboard } from 'lucide-react'; // Using layout icon for header

function App() {
  const [state, setState] = useState<PositionState>({
    depositAmount: 1000,
    entryPrice: 3000,
    minPrice: 1800,
    maxPrice: 5000,
    currentPrice: 3000,
  });

  const handleStateChange = (key: keyof PositionState, value: number) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 glass-card rounded-2xl bg-[var(--primary-color)]/20 border-[var(--primary-glow)]/30 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Uniswap v3 <span className="text-gradient">Simulator</span></h1>
            <p className="text-[var(--text-secondary)] text-xs uppercase tracking-widest font-semibold mt-1">Impermanent Loss & Strategy</p>
          </div>
        </div>

      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full pb-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-3 h-full">
          <InputSection values={state} onChange={handleStateChange} />
        </div>

        {/* Right Column: Dashboard */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Top Row: Metrics (Results Card) */}
          <div className="h-48">
            <ResultsCard state={state} />
          </div>

          {/* Bottom Row: Chart */}
          <div className="flex-1 min-h-[500px]">
            <ChartSection state={state} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
