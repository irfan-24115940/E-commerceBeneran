# MistCo Backend (Node + Express + PostgreSQL)

## Run

1) Install dependencies

```bash
npm install
```

2) Configure env

Copy `.env.example` to `.env` and set PostgreSQL credentials.

3) Run migrations (schema + seed)

```bash
npm run db:migrate
```

4) Start server

```bash
npm run dev
```

## Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /products`
- `GET /products/:id`
- `GET /categories`
- `GET /cart` (JWT required)
- `POST /cart/items`
- `PATCH /cart/items/:productId`
- `DELETE /cart/items/:productId`
- `DELETE /cart` 
- `GET /wishlist` (JWT required)
- `POST /wishlist/items`
- `DELETE /wishlist/items/:productId`
- `GET /orders` (JWT required)
- `POST /orders` (JWT required)
- `GET /payments` (JWT required)
- `POST /payments/verify` (JWT required)

## Response format

All endpoints return:
- Success: `{ success: true, message: '...', data: ... }`
- Error: `{ success: false, message: '...', error: { code, ... } }`

