import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Transaction,
  getInitialTransactions,
  saveTransactions,
  generateId,
  TransactionCategory,
  TransactionType,
} from "@/lib/mockData";

export type Role = "admin" | "viewer";
export type Theme = "light" | "dark";

export interface NewTransaction {
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  merchant?: string;
}

interface AppContextValue {
  role: Role;
  setRole: (role: Role) => void;
  theme: Theme;
  toggleTheme: () => void;
  transactions: Transaction[];
  addTransaction: (t: NewTransaction) => void;
  updateTransaction: (id: string, t: NewTransaction) => void;
  deleteTransaction: (id: string) => void;
  filterCategory: TransactionCategory | "all";
  setFilterCategory: (c: TransactionCategory | "all") => void;
  filterType: TransactionType | "all";
  setFilterType: (t: TransactionType | "all") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortField: keyof Transaction;
  setSortField: (f: keyof Transaction) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (d: "asc" | "desc") => void;
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
  if (typeof window === "undefined") return "viewer";
  return (localStorage.getItem("finance_role") as Role) || "viewer";
});

  const [theme, setTheme] = useState<Theme>(() => {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("finance_theme") as Theme) || "light";
});

  // Safely load stored transactions, falling back to mock data on failure
  const getStoredTransactions = (): Transaction[] => {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
  return getInitialTransactions(); // ✅ NEVER return empty
    }
      const stored = localStorage.getItem("finance_dashboard_transactions");
      if (!stored) return getInitialTransactions();
      try {
        const parsed = JSON.parse(stored) as Transaction[];
        return Array.isArray(parsed) ? parsed : getInitialTransactions();
      } catch {
        return getInitialTransactions();
      }
    } catch {
      try {
        return getInitialTransactions();
      } catch {
        return [];
      }
    }
  };

  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    getStoredTransactions()
  );

  // Ensure client always has initial data on first mount (handles SSR/hydration)
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      const t = getStoredTransactions();
      if (t && t.length) setTransactions(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [filterCategory, setFilterCategory] = useState<TransactionCategory | "all">("all");
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("finance_theme", theme);
  }, [theme]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    localStorage.setItem("finance_role", r);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const addTransaction = useCallback((t: NewTransaction) => {
    const newT: Transaction = { ...t, id: generateId() };
    setTransactions((prev) => [newT, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, t: NewTransaction) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...t, id } : tx))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        theme,
        toggleTheme,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
