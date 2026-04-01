# FinTrack — Finance Dashboard (Intern Submission)

A React-based finance tracker providing a centralized view of income, expenses, and patterns.

## Technical Architecture

### Component Structure
- **Root (`App`)**: Manages global state (transactions, user role, navigation).
- **Core Views**: `DashboardPage`, `TransactionsPage`, `InsightsPage`.
- **UI Components**: Sidebar with persistent navigation, Header with role simulation, Modals for data entry.
- **Micro-Components**: Functional badges, type pills, and custom chart tooltips for consistent UI.

### State & Logic
- **State Management**: Uses React's `useState` for transaction persistence and `useMemo` for high-performance filtering/sorting of records.
- **Routing**: Internal state-based page switching for a seamless SPA experience.
- **Data Visualization**: Implements `Recharts` for responsive, SVG-based Area, Pie, and Bar charts.

### Performance & Design
- **Optimized Rendering**: Filters and sorters only re-calculate on state changes, preventing unnecessary list re-renders.
- **Design System**: High-contrast dark theme with utility-first HSL tokens. Focus on numerical readability via JetBrains Mono.
- **Graceful States**: Handles empty datasets and loading states with informative placeholders.

## Features

- **Summary Dashboard**: Key metrics (Balance, Savings Rate) with trend indicators.
- **Transaction Engine**: Searchable, filterable list with Admin-only CRUD actions (Add/Edit/Delete).
- **Insights Engine**: Automated pattern detection (Top Category, Best Month, Savings qualitative feedback).
- **Export**: Dynamic CSV generator for filtered transaction downloads.

## Deployment & Setup

1. `npm install`
2. `npm run dev`

---
*Internship Candidate: Gowsikbabu Babu*
