import { cn, formatCurrency } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  colorClass?: string;
  "data-testid"?: string;
}

export function SummaryCard({
  title,
  amount,
  icon,
  trend,
  trendLabel,
  colorClass,
  "data-testid": testId,
}: SummaryCardProps) {
  const isPositiveTrend = trend !== undefined && trend >= 0;

  return (
    <div
      className="bg-card border border-card-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
      data-testid={testId}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight" data-testid={`${testId}-amount`}>
            {formatCurrency(amount)}
          </p>
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorClass)}>
          {icon}
        </div>
      </div>
      {trend !== undefined && trendLabel && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-medium",
              isPositiveTrend ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
            )}
          >
            {isPositiveTrend ? "+" : ""}{trend.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
