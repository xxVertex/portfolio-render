import { createContext, useContext, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const ExpenseContext = createContext();

export const CATEGORIES = [
  { id: "food", label: "Food & Dining", color: "#f97316", icon: "🍽️" },
  { id: "transport", label: "Transport", color: "#3b82f6", icon: "🚗" },
  { id: "housing", label: "Housing", color: "#8b5cf6", icon: "🏠" },
  { id: "entertainment", label: "Entertainment", color: "#ec4899", icon: "🎬" },
  { id: "health", label: "Health", color: "#10b981", icon: "💊" },
  { id: "shopping", label: "Shopping", color: "#f59e0b", icon: "🛍️" },
  { id: "education", label: "Education", color: "#06b6d4", icon: "📚" },
  { id: "other", label: "Other", color: "#6b7280", icon: "📦" },
];

const SAMPLE_EXPENSES = [
  { id: uuidv4(), amount: 45.5, category: "food", description: "Grocery run", date: new Date().toISOString().slice(0, 10), note: "" },
  { id: uuidv4(), amount: 12.0, category: "transport", description: "Uber ride", date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), note: "" },
  { id: uuidv4(), amount: 800, category: "housing", description: "Monthly rent", date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10), note: "Due on the 1st" },
  { id: uuidv4(), amount: 29.99, category: "entertainment", description: "Netflix + Spotify", date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10), note: "" },
  { id: uuidv4(), amount: 60.0, category: "health", description: "Gym membership", date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10), note: "" },
  { id: uuidv4(), amount: 134.2, category: "shopping", description: "New shoes", date: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10), note: "On sale" },
  { id: uuidv4(), amount: 22.5, category: "food", description: "Lunch with team", date: new Date(Date.now() - 8 * 86400000).toISOString().slice(0, 10), note: "" },
  { id: uuidv4(), amount: 9.99, category: "education", description: "Udemy course", date: new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10), note: "" },
];

const DEFAULT_BUDGETS = {
  food: 400,
  transport: 150,
  housing: 1000,
  entertainment: 100,
  health: 150,
  shopping: 200,
  education: 80,
  other: 100,
};

const initialState = {
  expenses: SAMPLE_EXPENSES,
  budgets: DEFAULT_BUDGETS,
  filters: { category: "all", dateRange: "month", search: "" },
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_EXPENSE":
      return { ...state, expenses: [{ id: uuidv4(), ...action.payload }, ...state.expenses] };
    case "DELETE_EXPENSE":
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.payload) };
    case "UPDATE_EXPENSE":
      return { ...state, expenses: state.expenses.map((e) => (e.id === action.payload.id ? action.payload : e)) };
    case "SET_BUDGET":
      return { ...state, budgets: { ...state.budgets, [action.payload.category]: action.payload.amount } };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "LOAD_STATE":
      return action.payload;
    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem("expense-tracker-state");
      return saved ? JSON.parse(saved) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem("expense-tracker-state", JSON.stringify(state));
  }, [state]);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}
