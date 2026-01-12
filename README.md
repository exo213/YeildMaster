# YieldMaster PRO

YieldMaster PRO is a high-fidelity semiconductor manufacturing yield simulator and economic analysis tool. It allows engineers and fab managers to model yield loss, visualize wafer maps, and analyze the economic impact of process variations.

## 🚀 Core Features

- **Multi-Model Yield Calculation**: Supports Poisson, Murphy, and Negative Binomial (Clustering) models.
- **Interactive Wafer Visualization**: Dynamic SVG-based wafer map showing die layout and estimated defect distribution.
- **Economic Analysis**: Cost-per-good-die (CPGD) tracking and trend analysis.
- **Repair & Redundancy Modeling**: Simulate the impact of chip repair strategies on effective yield.

## 🔬 Industry-Standard Logic Upgrades

### 1. Geometric Logic: Edge Exclusion
- **Formula**: `Effective Diameter = Diameter - (2 × Edge Exclusion)`
- Accounts for the "kill zone" at the wafer's edge caused by handling, clamping, and process non-uniformity.

### 2. Defect Logic: Critical Area (Pattern Density)
- **Concept**: Yield is calculated based on the *Critical Area* (`Die Area × Pattern Density`) rather than total area.
- Recognizes that defects in "white space" do not cause electrical failure.

### 3. Economic Logic: Fab Utilization
- **Formula**: `Effective Wafer Cost = Base Wafer Cost / Utilization`
- Models how low fab throughput increases the effective cost per wafer due to fixed-cost depreciation.

### 4. Yield Model Selection: Systematic Yield Limiter
- **Formula**: `Final Yield = Random Yield × Process Maturity`
- Prevents unrealistic 100% yield scenarios by accounting for systematic limitations (litho focus, etch variation, etc.).

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Logic**: Custom JavaScript Math Engine
- **Visualization**: D3-inspired SVG rendering

