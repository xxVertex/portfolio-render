import { useState } from "react";
import { Plus, LayoutDashboard, List, Settings } from "lucide-react";
import { ExpenseProvider } from "./context/ExpenseContext";
import Dashboard from "./components/Dashboard";
import ExpenseList from "./components/ExpenseList";
import BudgetSettings from "./components/BudgetSettings";
import ExpenseForm from "./components/ExpenseForm";
import "./App.css";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "expenses", label: "Expenses", icon: List },
  { id: "budgets", label: "Budgets", icon: Settings },
];

function AppInner() {
  const [tab, setTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <span className="header__logo">◈</span>
            <span className="header__title">Spendr</span>
          </div>
          <nav className="nav">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  className={`nav__item ${tab === t.id ? "nav__item--active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  <Icon size={16} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </header>

      <main className="main">
        <div className="page-header">
          <h1>{tab === "dashboard" ? "Overview" : tab === "expenses" ? "All Expenses" : "Budget Settings"}</h1>
        </div>
        {tab === "dashboard" && <Dashboard />}
        {tab === "expenses" && <ExpenseList />}
        {tab === "budgets" && <BudgetSettings />}
      </main>

      {showForm && <ExpenseForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      <AppInner />
    </ExpenseProvider>
  );
}
