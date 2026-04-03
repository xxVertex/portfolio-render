import { useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from "lucide-react";
import { useExpenses, CATEGORIES } from "../context/ExpenseContext";
import { filterExpenses, getSpendingByCategory, getMonthlyTrend, formatCurrency, getBudgetStatus } from "../utils/helpers";

export default function Dashboard() {
  const { state } = useExpenses();
  const { expenses, budgets } = state;

  const monthFilter = { category: "all", dateRange: "month", search: "" };
  const monthlyExpenses = useMemo(() => filterExpenses(expenses, monthFilter), [expenses]);
  const totalMonthly = useMemo(() => monthlyExpenses.reduce((s, e) => s + e.amount, 0), [monthlyExpenses]);

  const spendingByCategory = useMemo(() => getSpendingByCategory(monthlyExpenses, CATEGORIES), [monthlyExpenses]);
  const trend = useMemo(() => getMonthlyTrend(expenses), [expenses]);

  const alerts = useMemo(() =>
    CATEGORIES.filter((cat) => {
      const spent = monthlyExpenses.filter((e) => e.category === cat.id).reduce((s, e) => s + e.amount, 0);
      return getBudgetStatus(spent, budgets[cat.id]) !== "ok";
    }), [monthlyExpenses, budgets]);

  const topCategory = spendingByCategory.sort((a, b) => b.total - a.total)[0];

  return (
    <div className="dashboard">
      <div className="summary-cards">
        <div className="card card--accent">
          <div className="card__icon"><DollarSign size={20} /></div>
          <div className="card__label">This Month</div>
          <div className="card__value">{formatCurrency(totalMonthly)}</div>
        </div>
        <div className="card">
          <div className="card__icon"><TrendingUp size={20} /></div>
          <div className="card__label">Transactions</div>
          <div className="card__value">{monthlyExpenses.length}</div>
        </div>
        <div className="card">
          <div className="card__icon"><TrendingDown size={20} /></div>
          <div className="card__label">Top Category</div>
          <div className="card__value">{topCategory?.total > 0 ? topCategory?.label : "—"}</div>
        </div>
        <div className={`card ${alerts.length > 0 ? "card--warning" : ""}`}>
          <div className="card__icon"><AlertTriangle size={20} /></div>
          <div className="card__label">Budget Alerts</div>
          <div className="card__value">{alerts.length}</div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="alerts">
          {alerts.map((cat) => {
            const spent = monthlyExpenses.filter((e) => e.category === cat.id).reduce((s, e) => s + e.amount, 0);
            const status = getBudgetStatus(spent, budgets[cat.id]);
            return (
              <div key={cat.id} className={`alert alert--${status}`}>
                <span>{cat.icon}</span>
                <span>
                  <strong>{cat.label}</strong>: {formatCurrency(spent)} / {formatCurrency(budgets[cat.id])}
                  {status === "over" ? " — Over budget!" : " — Approaching limit"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="charts">
        <div className="chart-card">
          <h3 className="chart-title">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={spendingByCategory.filter((c) => c.total > 0)} dataKey="total" nameKey="label" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                {spendingByCategory.filter((c) => c.total > 0).map((cat) => (
                  <Cell key={cat.id} fill={cat.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            {spendingByCategory.filter((c) => c.total > 0).map((cat) => (
              <div key={cat.id} className="legend__item">
                <span className="legend__dot" style={{ background: cat.color }} />
                <span>{cat.label}</span>
                <span className="legend__amount">{formatCurrency(cat.total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trend}>
              <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 12 }} />
              <YAxis tick={{ fill: "#888", fontSize: 12 }} />
              <Tooltip formatter={(v) => formatCurrency(v)} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="total" fill="#c8f04d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="budget-grid">
        <h3 className="section-title">Budget Overview</h3>
        <div className="budgets">
          {CATEGORIES.map((cat) => {
            const spent = monthlyExpenses.filter((e) => e.category === cat.id).reduce((s, e) => s + e.amount, 0);
            const pct = Math.min((spent / budgets[cat.id]) * 100, 100);
            const status = getBudgetStatus(spent, budgets[cat.id]);
            return (
              <div key={cat.id} className="budget-item">
                <div className="budget-item__header">
                  <span>{cat.icon} {cat.label}</span>
                  <span className="budget-item__amounts">{formatCurrency(spent)} / {formatCurrency(budgets[cat.id])}</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-bar__fill progress-bar__fill--${status}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
