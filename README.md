# e-plantShopping

A small React + Redux Toolkit demo shop for plants. Supports adding items to a cart, updating quantities, removing items, and a simple in-page checkout confirmation.

Key features

- Add/remove items and adjust quantities
- Cart total calculation
- In-page checkout confirmation modal and toast

Tech

- React (Vite)
- Redux Toolkit

Quick start

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

Project layout (important files)

- `src/ProductList.jsx` — main product listing and add-to-cart logic
- `src/CartItem.jsx` — cart UI, checkout modal/toast
- `src/CartSlice.jsx` — Redux slice for cart state
- `src/plants.js` — sample product data
