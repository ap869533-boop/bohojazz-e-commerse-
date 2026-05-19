# BohoJazz - Multi-Vendor Fashion E-Commerce Platform

**Classic · Contemporary · Fusion**

A complete full-stack multi-vendor fashion e-commerce platform built with React, Tailwind CSS, Node.js, and MySQL.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, React Router v6 |
| State | React Context, TanStack Query |
| Backend | Node.js, Express.js |
| Database | MySQL 8+ |
| Auth | JWT (Access + Refresh tokens), RBAC |
| Charts | Recharts |
| Icons | Lucide React |

---

## 👥 Three Panels

| Panel | URL | Roles |
|-------|-----|-------|
| Customer/User | `/` | User (shopper) |
| Vendor | `/vendor` | Vendor (seller) |
| Admin | `/admin` | Admin (platform owner) |

---

## ⚡ Quick Setup

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema
source /path/to/backend/config/database.sql
```

Default admin credentials:
- **Email:** admin@bohojazz.com
- **Password:** Admin@123

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# Start development server
npm run dev

# Or production
npm start
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs on: http://localhost:3000
Backend runs on: http://localhost:5000

---

## 🔐 Authentication & RBAC

- **JWT Access Token**: 7-day validity
- **JWT Refresh Token**: 30-day validity with rotation
- **Roles**: `admin`, `vendor`, `user`
- Protected routes automatically redirect based on role
- Token auto-refresh on 401 responses

---

## 📁 Project Structure

```
bohojazz/
├── backend/
│   ├── config/
│   │   ├── db.js              # MySQL connection pool
│   │   └── database.sql       # Full DB schema + seed data
│   ├── controllers/
│   │   ├── authController.js  # Login, register, JWT
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── cartController.js
│   │   ├── vendorController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js            # JWT + RBAC middleware
│   ├── routes/
│   │   └── index.js           # All API routes
│   ├── uploads/               # Uploaded images stored here
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── common/
    │   │       ├── Navbar.jsx
    │   │       ├── Footer.jsx
    │   │       ├── ProductCard.jsx
    │   │       └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Auth + RBAC context
    │   │   └── CartContext.jsx  # Cart state
    │   ├── pages/
    │   │   ├── auth/           # Login, Register
    │   │   ├── user/           # Home, Shop, Cart, Orders...
    │   │   ├── vendor/         # Vendor dashboard & tools
    │   │   └── admin/          # Admin panel
    │   ├── utils/
    │   │   └── api.js          # Axios + interceptors
    │   ├── App.jsx             # Routes configuration
    │   └── index.css           # Tailwind + custom styles
    ├── tailwind.config.js
    └── package.json
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh` | Public |
| POST | `/api/auth/logout` | Public |
| GET | `/api/auth/me` | Auth |
| PUT | `/api/auth/change-password` | Auth |

### Products (Public)
| Method | Endpoint |
|--------|----------|
| GET | `/api/products` |
| GET | `/api/products/:slug` |
| GET | `/api/categories` |

### Cart & Wishlist
| Method | Endpoint |
|--------|----------|
| GET/POST/PUT/DELETE | `/api/cart` |
| GET/POST | `/api/wishlist` |

### Orders
| Method | Endpoint | Role |
|--------|----------|------|
| POST | `/api/orders` | User |
| GET | `/api/orders` | User |
| GET | `/api/orders/:id` | User |

### Vendor Panel
| Method | Endpoint |
|--------|----------|
| GET | `/api/vendor/dashboard` |
| GET/PUT | `/api/vendor/profile` |
| GET/POST | `/api/vendor/products` |
| GET/PUT | `/api/vendor/orders` |
| GET | `/api/vendor/analytics` |
| GET/POST | `/api/vendor/coupons` |

### Admin Panel
| Method | Endpoint |
|--------|----------|
| GET | `/api/admin/dashboard` |
| GET/PUT | `/api/admin/users` |
| GET/PUT | `/api/admin/vendors` |
| GET/PUT | `/api/admin/products` |
| GET/PUT | `/api/admin/orders` |
| GET/POST/PUT | `/api/admin/categories` |
| GET/PUT | `/api/admin/settings` |
| GET/POST/DELETE | `/api/admin/banners` |
| GET/PUT | `/api/admin/payouts` |
| GET/PUT/DELETE | `/api/admin/coupons` |

---

## 🚀 Production Deployment

### Backend (.env changes)
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=<strong-random-64-char-secret>
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### Build Frontend
```bash
cd frontend
npm run build
# Serve the /build folder with nginx or similar
```

---

## ✨ Features

### User/Customer
- Browse products with filters & search
- Product detail with images, variants, reviews
- Cart management
- Wishlist
- Address management
- Checkout with coupon support
- Order tracking

### Vendor
- Shop dashboard with earnings & analytics
- Product management (add/edit/archive)
- Order management with status updates
- Coupon creation
- Payout requests
- Analytics with charts

### Admin
- Platform dashboard with revenue charts
- User management (activate/ban)
- Vendor approval system
- Product review & approval
- Order management
- Category management
- Banner/slider management
- Coupon management
- Vendor payout processing
- Site settings

---


