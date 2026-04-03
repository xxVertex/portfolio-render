import { useState } from "react";
import { Check } from "lucide-react";
import { useExpenses, CATEGORIES } from "../context/ExpenseContext";
import { filterExpenses, formatCurrency, getBudgetStatus } from "../utils/helpers";

export default function BudgetSettings() {
  const { state, dispatch } = useExpenses();
  const { budgets, expenses } = state;
  const [editing, setEditing] = useState({});
  const [saved, setSaved] = useState({});

  const monthlyExpenses = filterExpenses(expenses, { category: "all", dateRange: "month", search: "" });

  function handleSave(catId) {
    const val = parseFloat(editing[catId]);
    if (!isNaN(val) && val > 0) {
      dispatch({ type: "SET_BUDGET", payload: { category: catId, amount: val } });
      setSaved((p) => ({ ...p, [catId]: true }));
      setTimeout(() => setSaved((p) => ({ ...p, [catId]: false })), 1500);
    }
    setEditing((p) => ({ ...p, [catId]: undefined }));
  }

  return (
    <div className="budget-settings">
      <p className="budget-settings__desc">Set monthly spending limits for each category. You'll get alerts when you're at 80% or over.</p>

      <div className="budget-cards">
        {CATEGORIES.map((cat) => {
          const spent = monthlyExpenses.filter((e) => e.category === cat.id).reduce((s, e) => s + e.amount, 0);
          const budget = budgets[cat.id];
          const pct = Math.min((spent / budget) * 100, 100);
          const status = getBudgetStatus(spent, budget);
          const isEditing = editing[cat.id] !== undefined;

          return (
            <div key={cat.id} className={`budget-card budget-card--${status}`}>
              <div className="budget-card__header">
                <span className="budget-card__icon">{cat.icon}</span>
                <span className="budget-card__label">{cat.label}</span>
                {status === "warning" && <span className="badge badge--warning">⚠ Near limit</span>}
                {status === "over" && <span className="badge badge--over">✕ Over!</span>}
                {saved[cat.id] && <span className="badge badge--saved">✓ Saved</span>}
              </div>

              <div className="budget-card__amounts">
                <span>Spent: <strong>{formatCurrency(spent)}</strong></span>
                <span>Limit: <strong>{formatCurrency(budget)}</strong></span>
              </div>

              <div className="progress-bar">
                <div className={`progress-bar__fill progress-bar__fill--${status}`} style={{ width: `${pct}%` }} />
              </div>

              <div className="budget-card__edit">
                {isEditing ? (
                  <div className="inline-edit">
                    <span>$</span>
                    <input
                      type="number"
                      className="input inline-edit__input"
                      value={editing[cat.id]}
                      onChange={(e) => setEditing((p) => ({ ...p, [cat.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleSave(cat.id)}
                      autoFocus
                    />
                    <button className="btn btn--primary btn--sm" onClick={() => handleSave(cat.id)}>
                      <Check size={14} /> Save
                    </button>
                    <button className="btn btn--ghost btn--sm" onClick={() => setEditing((p) => ({ ...p, [cat.id]: undefined }))}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button className="btn btn--ghost btn--sm" onClick={() => setEditing((p) => ({ ...p, [cat.id]: budgets[cat.id] }))}>
                    Edit Budget
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
