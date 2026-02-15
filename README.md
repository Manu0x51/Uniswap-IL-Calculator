# Uniswap v3 Impermanent Loss Simulator

A professional-grade dashboard for simulating and calculating **Impermanent Loss (IL)** in Uniswap V3 concentrated liquidity positions. This tool helps liquidity providers understand the risks and potential payoffs of their strategies by comparing LP returns against simply holding assets (HODL).

---

## 🚀 Overview

Uniswap V3 introduced **concentrated liquidity**, allowing users to provide liquidity within specific price ranges. While this increases capital efficiency, it also complicates the calculation of Impermanent Loss. This simulator provides a visual and mathematical approach to understanding:

- How liquidity is distributed within your chosen range.
- The precise payoff curve of your LP position.
- Real-time IL percentage based on price fluctuations.
- A direct comparison between LP Value and HODL Value.

## ✨ Key Features

- **Dynamic Range Management**: Adjust `Min Price` and `Max Price` to see how your liquidity concentrates and how it affects your risk profile.
- **Real-Time Simulation**: Use the `Current Price` slider/input to simulate market movements and instantly see the impact on your position.
- **Interactive Analytics**:
  - **Payoff Chart**: Visualizes the total value of your position vs. HODL across a wide price spectrum.
  - **IL Metrics**: Clear readouts of IL in both absolute value and percentage.
- **Asset Allocation**: Track how your position rebalances between Token0 and Token1 as the price moves.
- **Premium UI**: Dark-mode optimized, responsive design built with modern aesthetics (Glassmorphism, subtle animations).

## 🛠️ Tech Stack

- **Framework**: [React 19](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Visuals**: [Lucide React](https://lucide.dev/) (Icons) & [Recharts](https://recharts.org/) (Data Visualization)
- **Math**: Custom implementation of Uniswap V3 Liquidity & Value formulas.

## 🧮 How it Works

The app uses the official Uniswap V3 mathematical formulas to calculate liquidity ($L$) and asset amounts ($x, y$):

- **Liquidity Calculation**: Determined by the initial deposit and the price range $[P_{min}, P_{max}]$ at the entry price $P$.
- **Position Value**: Calculated as $V = x \cdot P + y$, where $x$ and $y$ are the virtual reserves at price $P$.
- **Impermanent Loss**: Defined as the difference between the LP position value and the value of the assets if they had been held outside the pool (HODL).

## 📦 Installation

To run this project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Uniswap-IL-Calculator.git
   cd Uniswap-IL-Calculator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## ⚠️ Disclaimer

*This tool is for educational and simulation purposes only. The calculations do not include trading fees earned, gas costs, or slippage. Defi involves significant risks, and you should perform your own due diligence before providing liquidity to any protocol.*

---

*Built with ❤️ for the DeFi Community.*
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
