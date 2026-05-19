# NL1 Backend

Simple Node.js + Express backend using JSON files as storage. Includes product CRUD, auth (JWT), orders and a simulated checkout.

Quick start

1. Node.js v16+ recommended
2. Open terminal in `nl1/backend`

Install:

```bash
npm install
```

Run in development:

```bash
npm run dev
```

Endpoints

- `POST /api/auth/register` — register user
- `POST /api/auth/login` — login -> returns `token`
- `GET /api/products` — list products
- `GET /api/products/:id` — product detail
- `POST /api/products` — create product (admin)
- `PUT /api/products/:id` — update product (admin)
- `DELETE /api/products/:id` — delete product (admin)
- `POST /api/checkout` — create order (simulate payment)
- `GET /api/orders` — get orders (auth required)

To create the first admin, call `POST /api/admin/create-initial` with `{ email, password }` once.

Notes

- This backend runs with local SQLite storage by default, so you do not need Docker or a MySQL server.
- The local SQLite database file is saved under `backend/data/app.db`.
- Set `JWT_SECRET` env var to change the default token secret.
