import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { formatCurrency, getMonthKey, getMonthLabel } from "@/lib/utils";
import { CATEGORY_COLORS, TransactionCategory } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Award, Target, Zap } from "lucide-react";

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  colorClass: string;
  "data-testid"?: string;
}

function InsightCard({ icon, title, value, subtitle, colorClass, "data-testid": testId }: InsightCardProps) {
  return (
    <div
      className="bg-card border border-card-border rounded-xl p-5 shadow-sm flex gap-4"
      data-testid={testId}
    >
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground mb-0.5">{title}</p>
        <p className="text-xl font-bold text-foreground truncate">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

export function Insights() {
  const { transactions } = useApp();

  const analysis = useMemo(() => {
    if (transactions.length === 0) return null;

    // Category breakdown
    const catMap = new Map<string, number>();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount);
      });

    const categoryData = Array.from(catMap.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, value }));

    const highestCategory = categoryData[0] ?? null;
    const totalExpenses = categoryData.reduce((s, c) => s + c.value, 0);

    // Monthly breakdown
    const monthMap = new Map<string, { income: number; expense: number }>();
    transactions.forEach((t) => {
      const key = getMonthKey(t.date);
      if (!monthMap.has(key)) monthMap.set(key, { income: 0, expense: 0 });
      const entry = monthMap.get(key)!;
      if (t.type === "income") entry.income += t.amount;
      else entry.expense += t.amount;
    });

    const monthlyData = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        month: getMonthLabel(key),
        Income: val.income,
        Expenses: val.expense,
        "Net Savings": Math.max(0, val.income - val.expense),
        deficit: Math.min(0, val.income - val.expense),
      }));

    // Savings rate
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Avg monthly expense
    const monthCount = monthMap.size;
    const avgMonthlyExpense = monthCount > 0 ? totalExpenses / monthCount : 0;
    const avgMonthlyIncome = monthCount > 0 ? totalIncome / monthCount : 0;

    // Month with highest expense
    let worstMonth = { month: "", expense: 0 };
    monthMap.forEach((val, key) => {
      if (val.expense > worstMonth.expense) {
        worstMonth = { month: getMonthLabel(key), expense: val.expense };
      }
    });

    // Month with best savings
    let bestSavingsMonth = { month: "", savings: -Infinity };
    monthMap.forEach((val, key) => {
      const savings = val.income - val.expense;
      if (savings > bestSavingsMonth.savings) {
        bestSavingsMonth = { month: getMonthLabel(key), savings };
      }
    });

    // Spending radar (top categories as % of total expenses)
    const radarData = categoryData.slice(0, 6).map((c) => ({
      category: c.name,
      pct: totalExpenses > 0 ? (c.value / totalExpenses) * 100 : 0,
    }));

    return {
      categoryData,
      highestCategory,
      totalExpenses,
      totalIncome,
      savingsRate,
      avgMonthlyExpense,
      avgMonthlyIncome,
      monthlyData,
      worstMonth,
      bestSavingsMonth,
      radarData,
    };
  }, [transactions]);

  if (!analysis) {
    return (
      <div className="flex items-center justify-center min-h-64" data-testid="page-insights-empty">
        <div className="text-center">
          <p className="text-muted-foreground">No data to analyze yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Add some transactions to see insights.</p>
        </div>
      </div>
    );
  }

  const {
    categoryData,
    highestCategory,
    totalExpenses,
    totalIncome,
    savingsRate,
    avgMonthlyExpense,
    avgMonthlyIncome,
    monthlyData,
    worstMonth,
    bestSavingsMonth,
    radarData,
  } = analysis;

  return (
    <div className="space-y-6" data-testid="page-insights">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Understand your financial patterns</p>
      </div>

      {/* Key Insights Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="insight-cards">
        <InsightCard
          icon={<Award className="w-5 h-5 text-amber-600" />}
          title="Highest Spending Category"
          value={highestCategory?.name ?? "N/A"}
          subtitle={highestCategory ? formatCurrency(highestCategory.value) + " total spent" : ""}
          colorClass="bg-amber-100 dark:bg-amber-900/30"
          data-testid="insight-highest-category"
        />
        <InsightCard
          icon={<Target className="w-5 h-5 text-primary" />}
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          subtitle={savingsRate >= 20 ? "Excellent! Above 20% goal" : savingsRate >= 10 ? "Good. Aim for 20%" : "Consider reducing expenses"}
          colorClass="bg-primary/10"
          data-testid="insight-savings-rate"
        />
        <InsightCard
          icon={<TrendingDown className="w-5 h-5 text-red-500" />}
          title="Highest Spending Month"
          value={worstMonth.month}
          subtitle={formatCurrency(worstMonth.expense) + " in expenses"}
          colorClass="bg-red-100 dark:bg-red-900/30"
          data-testid="insight-worst-month"
        />
        <InsightCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          title="Best Savings Month"
          value={bestSavingsMonth.month}
          subtitle={formatCurrency(Math.max(0, bestSavingsMonth.savings)) + " saved"}
          colorClass="bg-emerald-100 dark:bg-emerald-900/30"
          data-testid="insight-best-month"
        />
      </div>

      {/* Monthly Comparison Chart */}
      <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm" data-testid="chart-monthly-comparison">
        <h2 className="text-sm font-semibold text-foreground mb-1">Monthly Income vs. Expenses</h2>
        <p className="text-xs text-muted-foreground mb-4">Compare your earnings and spending over time</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
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
            <Legend
              iconSize={8}
              iconType="circle"
              formatter={(value) => (
                <span style={{ fontSize: "11px", color: "hsl(var(--muted-foreground))" }}>
                  {value}
                </span>
              )}
            />
            <Bar dataKey="Income" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="hsl(0,84%,60%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Net Savings" fill="hsl(142,71%,45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom two charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown Bar */}
        <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm" data-testid="chart-category-breakdown">
          <h2 className="text-sm font-semibold text-foreground mb-1">Spending by Category</h2>
          <p className="text-xs text-muted-foreground mb-4">How your expenses are distributed</p>
          <div className="space-y-3">
            {categoryData.slice(0, 8).map((cat) => {
              const pct = totalExpenses > 0 ? (cat.value / totalExpenses) * 100 : 0;
              return (
                <div key={cat.name} data-testid={`category-bar-${cat.name}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{pct.toFixed(1)}%</span>
                      <span className="text-xs font-semibold text-foreground">{formatCurrency(cat.value)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CATEGORY_COLORS[cat.name as TransactionCategory] ?? "#888",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spending radar */}
        <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm" data-testid="chart-spending-radar">
          <h2 className="text-sm font-semibold text-foreground mb-1">Spending Pattern</h2>
          <p className="text-xs text-muted-foreground mb-2">Top 6 categories as % of total expenses</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <Radar
                name="Spending %"
                dataKey="pct"
                stroke="hsl(217,91%,60%)"
                fill="hsl(217,91%,60%)"
                fillOpacity={0.25}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Observations */}
      <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm" data-testid="observations-panel">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Key Observations
        </h2>
        <div className="space-y-3">
          {savingsRate < 10 && (
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg" data-testid="obs-low-savings">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Low savings rate</p>
                <p className="text-xs text-muted-foreground">
                  Your current savings rate is {savingsRate.toFixed(1)}%. Financial advisors recommend saving at least 20% of your income.
                </p>
              </div>
            </div>
          )}

          {highestCategory && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg" data-testid="obs-top-category">
              <Award className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{highestCategory.name} is your biggest expense</p>
                <p className="text-xs text-muted-foreground">
                  You've spent {formatCurrency(highestCategory.value)} on {highestCategory.name} —{" "}
                  {totalExpenses > 0 ? ((highestCategory.value / totalExpenses) * 100).toFixed(1) : "0"}% of total expenses.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg" data-testid="obs-avg-expense">
            <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Monthly averages</p>
              <p className="text-xs text-muted-foreground">
                On average, you earn <strong>{formatCurrency(avgMonthlyIncome)}</strong> and spend{" "}
                <strong>{formatCurrency(avgMonthlyExpense)}</strong> per month — a net of{" "}
                <strong className={cn(avgMonthlyIncome - avgMonthlyExpense >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>
                  {formatCurrency(avgMonthlyIncome - avgMonthlyExpense)}
                </strong>.
              </p>
            </div>
          </div>

          {savingsRate >= 20 && (
            <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg" data-testid="obs-great-savings">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Great savings habit!</p>
                <p className="text-xs text-muted-foreground">
                  With a {savingsRate.toFixed(1)}% savings rate, you're ahead of the recommended 20% goal. Keep it up!
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg" data-testid="obs-income-diversity">
            <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Income breakdown</p>
              <p className="text-xs text-muted-foreground">
                Total income of {formatCurrency(totalIncome)} tracked across {transactions.filter(t => t.type === "income").length} income transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
