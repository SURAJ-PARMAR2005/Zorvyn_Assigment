# Fintech Dashboard

An elegant, high-fidelity fintech dashboard (brand: **Zorvyn**) built with **React + TypeScript + Vite**. It’s designed for a premium look and feel—glass panels, layered emerald gradients, smooth motion—and includes the core product surfaces you’d expect in a modern finance app: dashboard, accounts, transactions, and analytics.
<img width="1917" height="952" alt="image" src="https://github.com/user-attachments/assets/0baaeb1b-4608-4345-a326-ed99c3f891b0" />


## Why it’s cool

- **Premium UI system**: glassmorphism + glow, animated background ambience, tight spacing and typography.
- **Motion-first UX**: micro-interactions and page transitions that feel crisp without being distracting.
- **Data-rich screens**: Recharts-powered visuals and polished tables.
- **Account-driven dashboard**: “My Cards” is sourced from Accounts, and cycling the stack swaps the dashboard’s dataset.

## What’s inside

### Dashboard

- Total balance with a balance-trend sparkline.
- Weekly income/expense snapshots.
- Revenue flow + expense split visualizations.
- Recent transactions preview.
- **My Cards** stack:
	- Driven by Accounts (add a card in Accounts → it appears on the dashboard).
	- Click to cycle: top card goes to the back; the next card becomes active.
	- Up to 4 distinct dashboard profiles (`card1`–`card4`).

### Transactions

- Search and filters with a premium dropdown.
- Admin-only create/edit/delete.
- Export **CSV** and **JSON** (real file downloads).
- Navbar search routes to `/transactions?q=...`.

### Accounts

- Add and manage payment methods.
- Admin controls to set default and remove accounts.

### Analytics

- Responsive charts and timeframe switching.

## Tech stack

- React 19, TypeScript, Vite
- Tailwind CSS
- motion
- Zustand
- Recharts
- Lucide icons

## Quickstart

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

### Typecheck

```bash
npm run lint
```

## Repository notes

This project is currently a frontend demo with client-side state (no backend). It’s a solid starting point for wiring APIs, auth, and real financial data.

## License

MIT
