import { useMemo, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { useExpenses, CATEGORIES } from "../context/ExpenseContext";
import { filterExpenses, formatCurrency } from "../utils/helpers";
import ExpenseForm from "./ExpenseForm";

export default function ExpenseList() {
  const { state, dispatch } = useExpenses();
  const { expenses, filters } = state;
  const [editExpense, setEditExpense] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => filterExpenses(expenses, filters), [expenses, filters]);

  function getCat(id) {
    return CATEGORIES.find((c) => c.id === id);
  }

  function handleDelete(id) {
    dispatch({ type: "DELETE_EXPENSE", payload: id });
    setConfirmDelete(null);
  }

  return (
    <div className="expense-list">
      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) => dispatch({ type: "SET_FILTER", payload: { search: e.target.value } })}
            className="input search-input"
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => dispatch({ type: "SET_FILTER", payload: { category: e.target.value } })}
          className="input filter-select"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
          ))}
        </select>

        <select
          value={filters.dateRange}
          onChange={(e) => dispatch({ type: "SET_FILTER", payload: { dateRange: e.target.value } })}
          className="input filter-select"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <p>No expenses found</p>
        </div>
      ) : (
        <div className="expense-items">
          {filtered.map((expense) => {
            const cat = getCat(expense.category);
            return (
              <div key={expense.id} className="expense-item">
                <div className="expense-item__cat" style={{ background: cat?.color + "22", color: cat?.color }}>
                  {cat?.icon}
                </div>
                <div className="expense-item__info">
                  <div className="expense-item__desc">{expense.description}</div>
                  <div className="expense-item__meta">
                    <span className="tag" style={{ background: cat?.color + "22", color: cat?.color }}>{cat?.label}</span>
                    <span className="expense-item__date">{expense.date}</span>
                    {expense.note && <span className="expense-item__note">— {expense.note}</span>}
                  </div>
                </div>
                <div className="expense-item__amount">{formatCurrency(expense.amount)}</div>
                <div className="expense-item__actions">
                  <button className="icon-btn" onClick={() => setEditExpense(expense)}><Pencil size={15} /></button>
                  <button className="icon-btn icon-btn--danger" onClick={() => setConfirmDelete(expense.id)}><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editExpense && <ExpenseForm editExpense={editExpense} onClose={() => setEditExpense(null)} />}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal modal--small" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Expense?</h3>
            <p>This action cannot be undone.</p>
            <div className="form__actions">
              <button className="btn btn--ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn--danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
