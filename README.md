# FinTrack — Finance Dashboard (Candidate Submission)

### [Live Demo: zorvyn-inten-project.vercel.app](https://zorvyn-inten-project.vercel.app)

A React-based finance tracker providing a centralized view of income, expenses, and patterns.

## Technical Architecture

### 1. Modular Component Structure
The codebase is refactored into a scalable directory structure:
- **`src/components/UI.jsx`**: Global styling constants (HSL tokens) and shared atomic components (Badge, TypePill, Input).
- **`src/components/Layout.jsx`**: Structural components including a state-aware Sidebar and a multi-role Header.
- **`src/components/Dashboard.jsx`**: Visualization logic using Recharts (Area/Pie) for financial health metrics.
- **`src/components/Transactions.jsx`**: Record management featuring search, multi-filter, and sorting logic.
- **`src/components/Insights.jsx`**: Data parsing engine for automated pattern detection and qualitative feedback.

### 2. State & Performance
- **Single Source of Truth**: Global state managed at the root (`App.jsx`) to ensure synchronization across metrics and reports.
- **Optimized Rendering**: Uses `useMemo` for derived datasets (filtering/sorting) to maintain high performance with larger transaction lists.
- **SVG Viz**: Leverages **Recharts** for hardware-accelerated, responsive data visualization.

## Technical Signals

- **Component Decoupling**: View logic is separated from UI primitives.
- **Role-Based Logic**: Simulated `Admin` vs `Viewer` states to demonstrate conditional rendering and access control.
- **Numerical Precision**: Uses `Intl.NumberFormat` for currency and JetBrains Mono for perfect digit alignment.

## Setup

1. `npm install`
2. `npm run dev`

---
*Candidate: Gowsikbabu Babu*
