# Finance Dashboard Backend

A backend REST API for a finance dashboard system where different users interact with financial records based on their role. Built with Node.js, Express, and MongoDB.

---

# Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Role & Access Control](#role--access-control)
- [Assumptions](#assumptions)
- [Technical Decisions & Trade-offs](#technical-decisions--trade-offs)

---

# Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Atlas) |
| ODM | Mongoose |
| Auth | JSON Web Tokens (JWT) |
| Validation | express-validator |
| Password Hashing | bcryptjs |

---

# Features

- JWT-based authentication (register, login)
- Role-based access control — Admin, Analyst, Viewer
- Financial records CRUD with soft delete
- Filtering by type, category, date range, and keyword search
- Dashboard summary APIs using MongoDB aggregation pipeline
  - Total income, expenses, net balance
  - Category-wise totals
  - Monthly and weekly trends
  - Recent activity feed
- Input validation with structured error responses

---

# Project Structure

```
src/
├── config/
│   └── db.js                    # MongoDB connection
├── models/
│   ├── User.js                  # User schema with bcrypt pre-save hook
│   └── FinancialRecord.js       # Record schema with soft delete pre-find hook
├── controllers/
│   ├── auth.controller.js       # Register, login
│   ├── user.controller.js       # User management (admin only)
│   ├── record.controller.js     # Financial records CRUD
│   └── dashboard.controller.js  # Aggregation-based analytics
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── record.routes.js
│   └── dashboard.routes.js
├── middleware/
│   ├── protect.js               # JWT verification, attaches req.user
│   ├── checkRole.js             # Role-based access guard
│   └── validate.js              # express-validator error handler
├── validators/
│   ├── auth.validator.js
│   ├── user.validator.js
│   └── record.validator.js
└── app.js                       # Express app entry point
```

---

#Getting Started

## Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/SURAJ-PARMAR2005/Zorvyn_Assigment
cd backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Fill in your values (see Environment Variables section)

# 4. Start the server
npm run dev or npm start
```

Server runs at `http://localhost:3000`
## Live API

> Base URL: `https://zorvyn-assigment-ly09.onrender.com`

Import the Postman collection and switch the environment to **Finance API - Production** to test the live deployed API directly — no local setup needed.

---

# Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/finance-db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
```

| Variable | Description |
|----------|-------------|
| `MONGOOSE_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. `7d`) |
| `PORT` | Port the server runs on |

---

# API Reference

Import `API_DOCUMENTATION.json` and `Finance_API_Local.postman_environment.json` into Postman to explore and test all endpoints interactively.

# Authentication

All protected routes require a JWT token in the `Authorization` header:

```
Authorization: Cookies <your_token>
```

Get a token by calling `POST /api/auth/login` or `POST /api/auth/register`

# Endpoints

# Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT token |
| POST | `/api/auth/logout` | Public |Logout and delete the JWT token |

# Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users/:id` | Admin | Get user by ID |
| PATCH | `/api/users/:id/role` | Admin | Update user role |
| PATCH | `/api/users/:id/status` | Admin | Activate or deactivate user |
| DELETE | `/api/users/:id` | Admin | Delete user |

# Financial Records
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/records` | All roles | Get records (paginated, filterable) |
| POST | `/api/records` | Admin, Analyst | Create a record |
| GET | `/api/records/:id` | All roles | Get record by ID |
| PUT | `/api/records/:id` | Admin, Analyst | Update a record |
| DELETE | `/api/records/:id` | Admin | Soft delete a record |

**Supported query parameters for `GET /api/records`:**

| Parameter | Type | Example |
|-----------|------|---------|
| `type` | string | `income` or `expense` |
| `category` | string | `salary` |
| `startDate` | ISO date | `2024-01-01` |
| `endDate` | ISO date | `2024-03-31` |

# Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/summary` | All roles | Total income, expenses, net balance |
| GET | `/api/dashboard/categories` | Admin, Analyst | Category-wise totals |
| GET | `/api/dashboard/trends/monthly` | Admin, Analyst | Monthly income/expense trends |
| GET | `/api/dashboard/trends/weekly` | Admin, Analyst | Last 7 days breakdown |
| GET | `/api/dashboard/recent` | All roles | Most recent records |

---

# Role & Access Control

| Role | Records | Dashboard | Users |
|------|---------|-----------|-------|
| Viewer | Read only | Summary + Recent | — |
| Analyst | Read + Create + Update own | Full access | — |
| Admin | Full CRUD | Full access | Full management |

Access is enforced at the route level using two middleware functions:

- `protect` — verifies the JWT token and attaches `req.user`
- `checkRole(...roles)` — checks that the authenticated user's role is allowed

Example:
```js
router.delete('/:id', protect, checkRole('admin'), deleteRecord);
```

---

# Assumptions

- Roles are assigned at registration or updated by an Admin — no self-service role upgrade
- Amounts are stored as plain numbers in the base currency — no multi-currency support
- Categories are free-form strings — `"Food"` and `"food"` are treated as the same via case-insensitive querying
- Dates are stored in UTC — timezone handling is the responsibility of the client
- Soft-deleted records are hidden from all queries automatically via a Mongoose `pre(/^find/)` hook — they are not recoverable via the API

---

# Technical Decisions & Trade-offs

*JWT over sessions** — Stateless auth scales horizontally without shared session storage. Trade-off: tokens cannot be revoked before expiry. The `isActive` check on every request partially mitigates this.

*Soft delete over hard delete** — Financial data has audit value. Permanently deleting records loses history. The `pre(/^find/)` hook enforces the filter at the model level so no controller needs to remember to add `isDeleted: false` manually.

*MongoDB aggregation for dashboard** — Aggregation runs inside MongoDB so only computed results travel over the network. This is significantly faster than fetching all records into memory and computing in JavaScript.

*Compound indexes on FinancialRecord** — Three indexes on `(user, date)`, `(user, type)`, and `(user, category)` cover all dashboard query patterns. Every query filters by `user` first, so `user` is the leading key in each index.

*Validators as separate files — Keeps controllers focused on business logic only. Validation rules are reusable across routes — `validateRecord` is shared by both POST and PUT.

---

# Response Format

All responses follow a consistent structure:

**Success:**
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

**Validation error:**
```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "amount", "message": "Amount is required" }
  ]
}
```

*Error:
```json
{
  "message": "Record not found"
}
```

---

# HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthenticated (missing or invalid token) |
| 403 | Unauthorized (valid token, wrong role) |
| 404 | Resource not found |
| 500 | Internal server error |
