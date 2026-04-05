# FinanceIQ — Finance Dashboard

A clean, interactive personal finance dashboard built with **React + Vite + TypeScript**, designed to showcase frontend design, state management, and UX best practices using mock data.

---

## Features

### Dashboard Overview

* Summary cards: Total Balance, Income, and Expenses with month-over-month trends
* Area chart showing monthly income vs. expenses
* Donut chart showing spending breakdown by category
* Recent transactions list with "View all" option

### Transactions

* Full transaction list with Date, Description, Merchant, Category, Type, and Amount
* **Search**, **filter**, and **sort** by any column
* Admin role can **add, edit, and delete** transactions
* Export filtered transactions to CSV

### Insights

* Cards showing highest spending category, savings rate, and monthly comparisons
* Bar chart: Monthly income vs expenses
* Radar chart: Spending patterns across top categories
* Smart observations: Low savings warnings, category highlights, monthly averages

### Role-Based UI

* **Viewer:** Read-only access
* **Admin:** Full CRUD on transactions
* Role can be toggled from the sidebar

### Additional Features

* **Dark mode** (persisted via `localStorage`)
* **Responsive design** for mobile, tablet, and desktop
* State managed via **React Context + reducer pattern**
* Data persistence in `localStorage`

---

## Tech Stack

* **Frontend:** React 18 + Vite + TypeScript
* **Styling:** Tailwind CSS
* **Charts:** Recharts (Area, Bar, Pie, Radar)
* **Forms:** React Hook Form + Zod
* **Routing:** Router
* **UI Components:** shadcn/ui (Radix primitives)

---

## Getting Started

```bash
npm install
npm run dev
```

Open the URL printed by Vite in your browser (e.g., `http://localhost:5173`).

---

## Project Structure (High-Level)

```text
artifacts/finance-dashboard/
├── src/
│   ├── context/AppContext.tsx        # global state + reducer
│   ├── pages/Dashboard.tsx           # overview page
│   ├── pages/Transactions.tsx        # transaction list + filters
│   ├── pages/Insights.tsx            # analytics & insights
│   ├── components/                   # UI components (SummaryCard, TransactionRow, Forms)
│   └── lib/mockData.ts               # mock transactions and helpers
├── vite.config.ts
└── package.json
```

---

## State & Data

* Transactions, filters, selected role, and theme stored in Context
* Data persisted to `localStorage` to survive page reloads
* UI dynamically adapts based on selected role

---

## Extending the Project

* Replace mock data with real API calls
* Add authentication and server-side role enforcement
* Persist data to backend database and enhance CSV export

---

## Evaluation Highlights

* **Design & Clarity:** Clean layout, readable typography, clear visual hierarchy
* **Responsiveness:** Works across mobile, tablet, and desktop
* **Functionality:** Filtering, sorting, CSV export, role-based access
* **Technical Quality:** Modular components, reusable state logic, clear Context API usage

---

## License

MIT