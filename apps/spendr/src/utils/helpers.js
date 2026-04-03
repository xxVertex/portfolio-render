import { startOfMonth, startOfWeek, startOfYear, isAfter, parseISO } from "date-fns";

export function filterExpenses(expenses, filters) {
  let result = [...expenses];

  if (filters.category !== "all") {
    result = result.filter((e) => e.category === filters.category);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (e) =>
        e.description.toLowerCase().includes(q) ||
        e.note?.toLowerCase().includes(q)
    );
  }

  const now = new Date();
  if (filters.dateRange === "week") {
    const start = startOfWeek(now);
    result = result.filter((e) => isAfter(parseISO(e.date), start));
  } else if (filters.dateRange === "month") {
    const start = startOfMonth(now);
    result = result.filter((e) => isAfter(parseISO(e.date), start));
  } else if (filters.dateRange === "year") {
    const start = startOfYear(now);
    result = result.filter((e) => isAfter(parseISO(e.date), start));
  }

  return result.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getSpendingByCategory(expenses, categories) {
  return categories.map((cat) => {
    const total = expenses
      .filter((e) => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return { ...cat, total };
  });
}

export function getMonthlyTrend(expenses) {
  const months = {};
  expenses.forEach((e) => {
    const key = e.date.slice(0, 7);
    months[key] = (months[key] || 0) + e.amount;
  });
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, total]) => ({ month, total: parseFloat(total.toFixed(2)) }));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getBudgetStatus(spent, budget) {
  const pct = (spent / budget) * 100;
  if (pct >= 100) return "over";
  if (pct >= 80) return "warning";
  return "ok";
}
