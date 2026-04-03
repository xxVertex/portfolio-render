import { useState } from "react";
import { X } from "lucide-react";
import { useExpenses, CATEGORIES } from "../context/ExpenseContext";

const empty = { amount: "", category: "food", description: "", date: new Date().toISOString().slice(0, 10), note: "" };

export default function ExpenseForm({ onClose, editExpense }) {
  const { dispatch } = useExpenses();
  const [form, setForm] = useState(editExpense || empty);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) e.amount = "Enter a valid amount";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.date) e.date = "Date is required";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    const payload = { ...form, amount: parseFloat(form.amount) };
    if (editExpense) {
      dispatch({ type: "UPDATE_EXPENSE", payload });
    } else {
      dispatch({ type: "ADD_EXPENSE", payload });
    }
    onClose();
  }

  function set(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal__header">
          <h2>{editExpense ? "Edit Expense" : "Add Expense"}</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form__group">
            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              className={errors.amount ? "input input--error" : "input"}
            />
            {errors.amount && <span className="error">{errors.amount}</span>}
          </div>

          <div className="form__group">
            <label>Description</label>
            <input
              type="text"
              placeholder="What did you spend on?"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={errors.description ? "input input--error" : "input"}
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <div className="form__row">
            <div className="form__group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <div className="form__group">
              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className={errors.date ? "input input--error" : "input"}
              />
              {errors.date && <span className="error">{errors.date}</span>}
            </div>
          </div>

          <div className="form__group">
            <label>Note <span className="optional">(optional)</span></label>
            <input
              type="text"
              placeholder="Any extra details..."
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              className="input"
            />
          </div>

          <div className="form__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">{editExpense ? "Save Changes" : "Add Expense"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
