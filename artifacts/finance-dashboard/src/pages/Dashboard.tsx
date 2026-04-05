import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { SummaryCard } from "@/components/SummaryCard";
import { formatCurrency, getMonthKey, getMonthLabel } from "@/lib/utils";
import { CATEGORY_COLORS, TransactionCategory } from "@/lib/mockData";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const { transactions } = useApp();

  const { balance, totalIncome, totalExpenses, incomeByMonth, expensesByCategory, recentTransactions } =
    useMemo(() => {
      const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      const balance = totalIncome - totalExpenses;

      // Group by month
      const monthMap = new Map<string, { income: number; expense: number }>();
      transactions.forEach((t) => {
        const key = getMonthKey(t.date);
        if (!monthMap.has(key)) monthMap.set(key, { income: 0, expense: 0 });
        const entry = monthMap.get(key)!;
        if (t.type === "income") entry.income += t.amount;
        else entry.expense += t.amount;
      });
      const incomeByMonth = Array.from(monthMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, val]) => ({
          month: getMonthLabel(key),
          Income: val.income,
          Expenses: val.expense,
          Balance: val.income - val.expense,
        }));

      // Category breakdown (expenses)
      const catMap = new Map<string, number>();
      transactions
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount);
        });
      const expensesByCategory = Array.from(catMap.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([name, value]) => ({ name, value }));

      const recentTransactions = [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5);

      return { balance, totalIncome, totalExpenses, incomeByMonth, expensesByCategory, recentTransactions };
    }, [transactions]);

  // Calculate month-over-month trend for current month vs previous
  const { incomeTrend, expenseTrend } = useMemo(() => {
    const months = incomeByMonth;
    if (months.length < 2) return { incomeTrend: 0, expenseTrend: 0 };
    const curr = months[months.length - 1];
    const prev = months[months.length - 2];
    const incomeTrend = prev.Income > 0 ? ((curr.Income - prev.Income) / prev.Income) * 100 : 0;
    const expenseTrend = prev.Expenses > 0 ? ((curr.Expenses - prev.Expenses) / prev.Expenses) * 100 : 0;
    return { incomeTrend, expenseTrend };
  }, [incomeByMonth]);

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your financial overview at a glance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-testid="summary-cards">
        <SummaryCard
          title="Total Balance"
          amount={balance}
          icon={<Wallet className="w-5 h-5 text-primary" />}
          colorClass="bg-primary/10"
          data-testid="card-balance"
        />
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          icon={<TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          colorClass="bg-emerald-100 dark:bg-emerald-900/30"
          trend={incomeTrend}
          trendLabel="vs last month"
          data-testid="card-income"
        />
        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          icon={<TrendingDown className="w-5 h-5 text-red-500" />}
          colorClass="bg-red-100 dark:bg-red-900/30"
          trend={-expenseTrend}
          trendLabel="vs last month"
          data-testid="card-expenses"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Balance trend - 3 cols */}
        <div className="lg:col-span-3 bg-card border border-card-border rounded-xl p-5 shadow-sm" data-testid="chart-balance-trend">
          <h2 className="text-sm font-semibold text-foreground mb-4">Monthly Overview</h2>
          {incomeByMonth.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              No data to display
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={incomeByMonth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217,91%,60%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(217,91%,60%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0,84%,60%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(0,84%,60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.6} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area
                  type="monotone"
                  dataKey="Income"
                  stroke="hsl(217,91%,60%)"
                  strokeWidth={2}
                  fill="url(#colorIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="Expenses"
                  stroke="hsl(0,84%,60%)"
                  strokeWidth={2}
                  fill="url(#colorExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Spending breakdown - 2 cols */}
        <div className="lg:col-span-2 bg-card border border-card-border rounded-xl p-5 shadow-sm" data-testid="chart-spending-breakdown">
          <h2 className="text-sm font-semibold text-foreground mb-4">Spending Breakdown</h2>
          {expensesByCategory.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              No expense data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expensesByCategory.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[entry.name as TransactionCategory] ?? "#888"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ fontSize: "11px", color: "hsl(var(--muted-foreground))" }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card border border-card-border rounded-xl shadow-sm" data-testid="recent-transactions">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
          <Link href="/transactions">
            <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 h-7" data-testid="link-view-all-transactions">
              View all <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
        {recentTransactions.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No transactions yet
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors"
                data-testid={`transaction-row-${tx.id}`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[tx.category]}20`,
                    color: CATEGORY_COLORS[tx.category],
                  }}
                >
                  {tx.category.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.merchant ?? tx.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      tx.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-foreground"
                    )}
                  >
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs hidden sm:flex flex-shrink-0",
                    tx.type === "income"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                  )}
                >
                  {tx.type}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
