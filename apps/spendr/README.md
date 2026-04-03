# 💸 Spendr — Expense Tracker

A clean, modern expense tracker built with React. Track your spending, manage budgets per category, and visualize your habits with charts.

## Features

- ➕ **Add / Edit / Delete** expenses with category, date, and notes
- 📊 **Dashboard** with pie chart (spending by category) and bar chart (monthly trend)
- 🏷️ **8 Categories** — Food, Transport, Housing, Entertainment, Health, Shopping, Education, Other
- 🔍 **Filter** by category, date range, or keyword search
- 💰 **Budget limits** per category with progress bars
- ⚠️ **Alerts** when you're at 80% or over your budget
- 💾 **localStorage persistence** — your data survives page refresh

## Tech Stack

- [React 18](https://reactjs.org/)
- [Recharts](https://recharts.org/) — charts
- [Lucide React](https://lucide.dev/) — icons
- [date-fns](https://date-fns.org/) — date utilities
- [uuid](https://github.com/uuidjs/uuid) — unique IDs

## Getting Started

```bash
# Clone the repo
git clone https://github.com/xxVertex/expense-tracker.git
cd expense-tracker

# Install dependencies
npm install

# Start the dev server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
```

Output will be in the `/build` folder, ready to deploy to Vercel, Netlify, or GitHub Pages.

## Deploy to Vercel (one-click)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Click Deploy — done!

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx       # Overview with charts and budget progress
│   ├── ExpenseList.jsx     # Filterable list of all expenses
│   ├── ExpenseForm.jsx     # Add / edit modal form
│   └── BudgetSettings.jsx  # Set per-category budget limits
├── context/
│   └── ExpenseContext.jsx  # Global state with useReducer + localStorage
├── utils/
│   └── helpers.js          # Filter, format, aggregation utilities
├── App.jsx                 # Root layout + navigation
└── App.css                 # Full design system (dark theme)
```

## License

MIT
