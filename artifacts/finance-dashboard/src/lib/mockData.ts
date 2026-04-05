export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Food & Dining"
  | "Shopping"
  | "Housing"
  | "Transportation"
  | "Entertainment"
  | "Healthcare"
  | "Utilities"
  | "Education"
  | "Travel"
  | "Subscriptions"
  | "Other";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  merchant?: string;
}

export const INCOME_CATEGORIES: TransactionCategory[] = [
  "Salary",
  "Freelance",
  "Investment",
];

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "Food & Dining",
  "Shopping",
  "Housing",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Utilities",
  "Education",
  "Travel",
  "Subscriptions",
  "Other",
];

export const ALL_CATEGORIES: TransactionCategory[] = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
];

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  Salary: "#3b82f6",
  Freelance: "#06b6d4",
  Investment: "#8b5cf6",
  "Food & Dining": "#f59e0b",
  Shopping: "#ec4899",
  Housing: "#6366f1",
  Transportation: "#84cc16",
  Entertainment: "#f97316",
  Healthcare: "#14b8a6",
  Utilities: "#64748b",
  Education: "#a855f7",
  Travel: "#0ea5e9",
  Subscriptions: "#e11d48",
  Other: "#78716c",
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  // January
  { id: "t001", date: "2026-01-02", description: "Monthly Salary", amount: 5800, category: "Salary", type: "income", merchant: "TechCorp Inc." },
  { id: "t002", date: "2026-01-03", description: "Grocery Shopping", amount: 124.5, category: "Food & Dining", type: "expense", merchant: "Whole Foods" },
  { id: "t003", date: "2026-01-05", description: "Rent Payment", amount: 1800, category: "Housing", type: "expense", merchant: "Sunset Apartments" },
  { id: "t004", date: "2026-01-07", description: "Netflix Subscription", amount: 15.99, category: "Subscriptions", type: "expense", merchant: "Netflix" },
  { id: "t005", date: "2026-01-08", description: "Freelance Project", amount: 850, category: "Freelance", type: "income", merchant: "Design Studio X" },
  { id: "t006", date: "2026-01-10", description: "Gas Station", amount: 62, category: "Transportation", type: "expense", merchant: "Shell" },
  { id: "t007", date: "2026-01-12", description: "Dinner with Friends", amount: 89.5, category: "Food & Dining", type: "expense", merchant: "The Grill House" },
  { id: "t008", date: "2026-01-15", description: "Spotify Premium", amount: 9.99, category: "Subscriptions", type: "expense", merchant: "Spotify" },
  { id: "t009", date: "2026-01-18", description: "Amazon Purchase", amount: 145.32, category: "Shopping", type: "expense", merchant: "Amazon" },
  { id: "t010", date: "2026-01-20", description: "Dividend Income", amount: 340, category: "Investment", type: "income", merchant: "Vanguard" },
  { id: "t011", date: "2026-01-22", description: "Electricity Bill", amount: 88.4, category: "Utilities", type: "expense", merchant: "City Power" },
  { id: "t012", date: "2026-01-24", description: "Coffee & Lunch", amount: 28, category: "Food & Dining", type: "expense", merchant: "Blue Bottle Coffee" },
  { id: "t013", date: "2026-01-25", description: "Gym Membership", amount: 45, category: "Healthcare", type: "expense", merchant: "FitLife Gym" },
  { id: "t014", date: "2026-01-28", description: "Online Course", amount: 199, category: "Education", type: "expense", merchant: "Coursera" },
  { id: "t015", date: "2026-01-30", description: "Movie Tickets", amount: 34, category: "Entertainment", type: "expense", merchant: "AMC Theaters" },

  // February
  { id: "t016", date: "2026-02-02", description: "Monthly Salary", amount: 5800, category: "Salary", type: "income", merchant: "TechCorp Inc." },
  { id: "t017", date: "2026-02-03", description: "Grocery Shopping", amount: 98.7, category: "Food & Dining", type: "expense", merchant: "Trader Joe's" },
  { id: "t018", date: "2026-02-05", description: "Rent Payment", amount: 1800, category: "Housing", type: "expense", merchant: "Sunset Apartments" },
  { id: "t019", date: "2026-02-08", description: "Valentine's Dinner", amount: 165, category: "Food & Dining", type: "expense", merchant: "Le Bernardin" },
  { id: "t020", date: "2026-02-10", description: "Car Insurance", amount: 120, category: "Transportation", type: "expense", merchant: "State Farm" },
  { id: "t021", date: "2026-02-12", description: "Freelance Project", amount: 1200, category: "Freelance", type: "income", merchant: "Startup ABC" },
  { id: "t022", date: "2026-02-14", description: "Flowers & Gift", amount: 75, category: "Shopping", type: "expense", merchant: "1-800-Flowers" },
  { id: "t023", date: "2026-02-15", description: "Netflix Subscription", amount: 15.99, category: "Subscriptions", type: "expense", merchant: "Netflix" },
  { id: "t024", date: "2026-02-18", description: "Doctor Visit Copay", amount: 40, category: "Healthcare", type: "expense", merchant: "City Medical" },
  { id: "t025", date: "2026-02-20", description: "Stock Dividend", amount: 280, category: "Investment", type: "income", merchant: "Fidelity" },
  { id: "t026", date: "2026-02-22", description: "Internet Bill", amount: 79.99, category: "Utilities", type: "expense", merchant: "Comcast" },
  { id: "t027", date: "2026-02-24", description: "New Headphones", amount: 249, category: "Shopping", type: "expense", merchant: "Best Buy" },
  { id: "t028", date: "2026-02-26", description: "Concert Tickets", amount: 120, category: "Entertainment", type: "expense", merchant: "Ticketmaster" },

  // March
  { id: "t029", date: "2026-03-02", description: "Monthly Salary", amount: 5800, category: "Salary", type: "income", merchant: "TechCorp Inc." },
  { id: "t030", date: "2026-03-03", description: "Grocery Shopping", amount: 112, category: "Food & Dining", type: "expense", merchant: "Whole Foods" },
  { id: "t031", date: "2026-03-05", description: "Rent Payment", amount: 1800, category: "Housing", type: "expense", merchant: "Sunset Apartments" },
  { id: "t032", date: "2026-03-07", description: "Spotify Premium", amount: 9.99, category: "Subscriptions", type: "expense", merchant: "Spotify" },
  { id: "t033", date: "2026-03-09", description: "Freelance Project", amount: 950, category: "Freelance", type: "income", merchant: "Creative Agency" },
  { id: "t034", date: "2026-03-12", description: "Bus Pass", amount: 90, category: "Transportation", type: "expense", merchant: "Metro Transit" },
  { id: "t035", date: "2026-03-14", description: "Restaurant Outing", amount: 76, category: "Food & Dining", type: "expense", merchant: "Noodle Palace" },
  { id: "t036", date: "2026-03-15", description: "Netflix Subscription", amount: 15.99, category: "Subscriptions", type: "expense", merchant: "Netflix" },
  { id: "t037", date: "2026-03-17", description: "Spring Clothes", amount: 320, category: "Shopping", type: "expense", merchant: "Zara" },
  { id: "t038", date: "2026-03-18", description: "Dividend Income", amount: 420, category: "Investment", type: "income", merchant: "Vanguard" },
  { id: "t039", date: "2026-03-20", description: "Water & Electricity", amount: 102, category: "Utilities", type: "expense", merchant: "City Utilities" },
  { id: "t040", date: "2026-03-22", description: "Yoga Classes", amount: 60, category: "Healthcare", type: "expense", merchant: "Zen Studio" },
  { id: "t041", date: "2026-03-25", description: "Books", amount: 55, category: "Education", type: "expense", merchant: "Amazon Books" },
  { id: "t042", date: "2026-03-28", description: "Weekend Trip", amount: 450, category: "Travel", type: "expense", merchant: "Airbnb" },

  // April (current month, partial)
  { id: "t043", date: "2026-04-01", description: "Monthly Salary", amount: 5800, category: "Salary", type: "income", merchant: "TechCorp Inc." },
  { id: "t044", date: "2026-04-02", description: "Grocery Shopping", amount: 91, category: "Food & Dining", type: "expense", merchant: "Whole Foods" },
  { id: "t045", date: "2026-04-03", description: "Rent Payment", amount: 1800, category: "Housing", type: "expense", merchant: "Sunset Apartments" },
  { id: "t046", date: "2026-04-04", description: "Coffee & Snacks", amount: 22, category: "Food & Dining", type: "expense", merchant: "Starbucks" },
  { id: "t047", date: "2026-04-05", description: "Freelance Payment", amount: 1400, category: "Freelance", type: "income", merchant: "Tech Startup XYZ" },
];

export const getInitialTransactions = (): Transaction[] => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return INITIAL_TRANSACTIONS; // ✅ SSR safe
    }

    const stored = window.localStorage.getItem("finance_dashboard_transactions");

    if (!stored) return INITIAL_TRANSACTIONS;

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : INITIAL_TRANSACTIONS;

  } catch {
    return INITIAL_TRANSACTIONS; // ✅ NEVER break UI
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem("finance_dashboard_transactions", JSON.stringify(transactions));
};

export const generateId = (): string => {
  return "t" + Date.now().toString().slice(-6) + Math.random().toString(36).slice(2, 5);
};

export const MONTHS_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const MONTH_NAMES: Record<number, string> = {
  1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June",
  7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December",
};
