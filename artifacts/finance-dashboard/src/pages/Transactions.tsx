import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { TransactionForm } from "@/components/TransactionForm";
import { ALL_CATEGORIES, CATEGORY_COLORS, Transaction, TransactionCategory } from "@/lib/mockData";
import { formatCurrency, formatDate, getMonthKey, getMonthLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Plus, Search, Trash2, Pencil, ChevronUp, ChevronDown, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NewTransaction } from "@/context/AppContext";

export function Transactions() {
  const {
    role,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    selectedMonth,
    setSelectedMonth,
  } = useApp();

  const [formOpen, setFormOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const availableMonths = useMemo(() => {
    const keys = new Set<string>();
    transactions.forEach((t) => keys.add(getMonthKey(t.date)));
    return Array.from(keys).sort().reverse();
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (selectedMonth !== "all") {
      list = list.filter((t) => getMonthKey(t.date) === selectedMonth);
    }
    if (filterCategory !== "all") {
      list = list.filter((t) => t.category === filterCategory);
    }
    if (filterType !== "all") {
      list = list.filter((t) => t.type === filterType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.merchant ?? "").toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let valA: string | number = a[sortField] ?? "";
      let valB: string | number = b[sortField] ?? "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [transactions, selectedMonth, filterCategory, filterType, searchQuery, sortField, sortDirection]);

  const totals = useMemo(() => {
    const income = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense };
  }, [filtered]);

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleAdd = (t: NewTransaction) => {
    addTransaction(t);
  };

  const handleEdit = (t: NewTransaction) => {
    if (editTransaction) {
      updateTransaction(editTransaction.id, t);
      setEditTransaction(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteTransaction(deleteId);
      setDeleteId(null);
    }
  };

  const handleExport = () => {
    const headers = ["Date", "Description", "Merchant", "Category", "Type", "Amount"];
    const rows = filtered.map((t) => [
      t.date,
      `"${t.description}"`,
      `"${t.merchant ?? ""}"`,
      t.category,
      t.type,
      t.amount.toFixed(2),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }: { field: keyof Transaction }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  };

  return (
    <div className="space-y-5" data-testid="page-transactions">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
            {filtered.length > 0 && (
              <>
                {" "}— <span className="text-emerald-600 dark:text-emerald-400">+{formatCurrency(totals.income)}</span>{" "}
                <span className="text-red-500">-{formatCurrency(totals.expense)}</span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2" data-testid="button-export-csv">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          {role === "admin" && (
            <Button size="sm" onClick={() => setFormOpen(true)} className="gap-2" data-testid="button-add-transaction">
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-card-border rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-36" data-testid="select-month">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All months</SelectItem>
              {availableMonths.map((m) => (
                <SelectItem key={m} value={m}>{getMonthLabel(m)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={(v) => setFilterType(v as "income" | "expense" | "all")}>
            <SelectTrigger className="w-full sm:w-32" data-testid="select-type-filter">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as TransactionCategory | "all")}>
            <SelectTrigger className="w-full sm:w-40" data-testid="select-category-filter">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {ALL_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden" data-testid="transactions-table">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm">No transactions match your filters.</p>
            {role === "admin" && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setFormOpen(true)}
                data-testid="button-add-first-transaction"
              >
                Add your first transaction
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-transactions">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th
                    className="text-left px-4 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
                    onClick={() => handleSort("date")}
                    data-testid="th-date"
                  >
                    <span className="flex items-center gap-1">
                      Date <SortIcon field="date" />
                    </span>
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
                    onClick={() => handleSort("description")}
                    data-testid="th-description"
                  >
                    <span className="flex items-center gap-1">
                      Description <SortIcon field="description" />
                    </span>
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none hidden md:table-cell"
                    onClick={() => handleSort("category")}
                    data-testid="th-category"
                  >
                    <span className="flex items-center gap-1">
                      Category <SortIcon field="category" />
                    </span>
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell"
                  >
                    Type
                  </th>
                  <th
                    className="text-right px-4 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
                    onClick={() => handleSort("amount")}
                    data-testid="th-amount"
                  >
                    <span className="flex items-center justify-end gap-1">
                      Amount <SortIcon field="amount" />
                    </span>
                  </th>
                  {role === "admin" && (
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-muted/30 transition-colors"
                    data-testid={`transaction-row-${tx.id}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground truncate max-w-[200px]">{tx.description}</p>
                        {tx.merchant && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{tx.merchant}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[tx.category]}18`,
                          color: CATEGORY_COLORS[tx.category],
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          tx.type === "income"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                        )}
                        data-testid={`badge-type-${tx.id}`}
                      >
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          "font-semibold text-sm",
                          tx.type === "income"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-foreground"
                        )}
                        data-testid={`amount-${tx.id}`}
                      >
                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    {role === "admin" && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setEditTransaction(tx);
                              setFormOpen(true);
                            }}
                            data-testid={`button-edit-${tx.id}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteId(tx.id)}
                            data-testid={`button-delete-${tx.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Forms & Dialogs */}
      <TransactionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTransaction(null);
        }}
        onSubmit={editTransaction ? handleEdit : handleAdd}
        editTransaction={editTransaction}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent data-testid="delete-confirm-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The transaction will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
