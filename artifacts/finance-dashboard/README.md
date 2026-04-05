# FinanceIQ — Finance Dashboard

A clean, interactive personal finance dashboard built with React + Vite and TypeScript.

## Getting Started

```bash
pnpm install
pnpm --filter @workspace/finance-dashboard run dev
```

Open `http://localhost:23522` in your browser.

## Features

### Dashboard Overview
- Summary cards: Total Balance, Total Income, and Total Expenses with month-over-month trends
- Area chart showing monthly income vs. expenses over time
- Donut chart showing spending breakdown by category
- Recent transactions list with quick "View all" navigation

### Transactions
- Full transaction list with date, description, merchant, category, type badge, and amount
- **Search** by description, category, or merchant
- **Filter** by month, transaction type (income/expense), and category
- **Sort** by any column (date, description, category, amount) — ascending or descending
- **Export to CSV** — download filtered transactions as a CSV file
- Admin: Add, edit, and delete transactions via a validated form

### Insights
- Key insight cards: highest spending category, savings rate, worst/best month
- Monthly income vs. expenses bar chart comparison
- Category spending breakdown with proportional bars and percentages
- Radar chart showing spending patterns across top 6 categories
- Smart contextual observations: low savings warnings, category highlights, monthly averages

### Role-Based UI
Switch roles from the sidebar at any time:
- **Viewer**: Read-only — browse and explore all data, export CSV
- **Admin**: Full access — add, edit, and delete transactions

### Additional Features
- **Dark mode** — persisted to localStorage, toggle from the sidebar
- **Data persistence** — all transactions stored in localStorage so data survives page refreshes
- **Responsive design** — mobile sidebar with overlay, responsive grid layouts
- **State management** — React Context with useReducer-like pattern for role, theme, filters, and transactions

## Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: Wouter
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **Charts**: Recharts (AreaChart, BarChart, PieChart, RadarChart)
- **Forms**: React Hook Form + Zod validation
- **Components**: shadcn/ui (Radix UI primitives)
- **State**: React Context API
- **Persistence**: localStorage

## Project Structure

```
src/
├── context/
│   └── AppContext.tsx      # Global state: role, theme, transactions, filters
├── components/
│   ├── Layout.tsx           # Sidebar navigation, mobile nav, theme/role controls
│   ├── SummaryCard.tsx      # Reusable summary metric card
│   └── TransactionForm.tsx  # Add/Edit transaction form (Admin only)
├── pages/
│   ├── Dashboard.tsx        # Overview: cards, charts, recent transactions
│   ├── Transactions.tsx     # Full list with filters, sort, CRUD
│   └── Insights.tsx         # Analytics: comparisons, patterns, observations
├── lib/
│   ├── mockData.ts          # 47 realistic mock transactions + helpers
│   └── utils.ts             # Formatting utilities
└── index.css                # Theme tokens (light + dark)
```

## Mock Data

47 pre-loaded transactions from January–April 2026 covering:
- Income: Salary, Freelance, Investment dividends
- Expenses: Housing, Food & Dining, Shopping, Transportation, Subscriptions, Healthcare, Entertainment, Utilities, Education, Travel
