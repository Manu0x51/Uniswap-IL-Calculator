import { createContext, useContext, useState, ReactNode } from 'react';
import type { PositionState } from '../utils/uniswapMath';

interface PositionContextType {
  state: PositionState;
  updateState: (key: keyof PositionState, value: number) => void;
}

const PositionContext = createContext<PositionContextType | undefined>(undefined);

interface PositionProviderProps {
  children: ReactNode;
}

export function PositionProvider({ children }: PositionProviderProps) {
  const [state, setState] = useState<PositionState>({
    depositAmount: 1000,
    entryPrice: 3000,
    minPrice: 1800,
    maxPrice: 5000,
    currentPrice: 3000,
  });

  const updateState = (key: keyof PositionState, value: number) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PositionContext.Provider value={{ state, updateState }}>
      {children}
    </PositionContext.Provider>
  );
}

export function usePosition() {
  const context = useContext(PositionContext);
  if (context === undefined) {
    throw new Error('usePosition must be used within a PositionProvider');
  }
  return context;
}
