# 💍 Tat Vivah

> **Premium Multi-Vendor E-commerce Platform** specifically designed for the modern wedding market.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Prisma](https://img.shields.io/badge/Prisma-5.0-teal)
![Redis](https://img.shields.io/badge/Redis-Cache-red)

**Tat Vivah** is a robust, scalable e-commerce solution built with a micro-services inspired layered monolith architecture. It connects buyers with sellers of premium wedding attire and accessories, featuring real-time inventory management, secure authentication, and a seamless checkout experience.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization
- **Role-Based Access Control (RBAC)**: Distinct distinct flows for **Buyers**, **Sellers**, and **Admins**.
- **Secure Sessions**: JWT-based stateless authentication with secure cookie storage.
- **Middleware Protection**: Granular route protection using `authenticate` and `authorize` middlewares.

### 🛍️ Product Management
- **Hierarchical Categories**: Optimized category structure with slug-based navigation.
- **Complex Variants**: Support for multiple product variants (Size, Color, Material) with independent pricing.
- **Inventory Tracking**: Real-time stock management with concurrency protection.

### 🛒 Shopping Experience
- **Smart Cart**: Persistent shopping carts with real-time stock validation and price snapshotting.
- **Redis Caching**: High-performance caching for product catalogs and user carts to minimize database load.
- **Transactional Checkout**: Atomic operations for order creation and inventory deduction to prevent race conditions.

### 📦 Order fulfillment
- **Multi-Seller Orders**: Buyers can purchase items from multiple sellers in a single transaction.
- **Seller Dashboard**: Dedicated views for sellers to manage their specific line items within global orders.
- **Audit Logging**: `InventoryMovement` logs track every stock change (Reserve, Release, Deduct) for full accountability.

---

## 🛠️ Technology Stack

### Backend API
- **Runtime**: Node.js (Express.js)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Neon Serverless)
- **ORM**: Prisma (with automated migrations)
- **Caching**: Redis (Upstash)
- **Validation**: Zod
- **Documentation**: OpenAPI / Scalar

### Frontend
- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / CSS Modules

---

## 🏗️ Project Structure

```
Tat_Vivah/
├── backend/                 # API Server
│   ├── src/
│   │   ├── config/          # Environment & DB Config
│   │   ├── controllers/     # Request Handlers
│   │   ├── middlewares/     # Auth & Error Handling
│   │   ├── services/        # Business Logic
│   │   ├── repositories/    # Data Access Layer
│   │   ├── routes/          # API Definitions
│   │   └── types/           # TS Interfaces
│   ├── prisma/              # Schema & Migrations
│   └── scripts/             # Verification Scripts
│
└── frontend/                # Next.js Client application
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm
- PostgreSQL Database (Local or Cloud)
- Redis Instance (Local or Cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tat-vivah.git
   cd tat-vivah
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://user:password@host:port/dbname"
   REDIS_URL="redis://default:password@host:port"
   JWT_SECRET="your-super-secret-key"
   NODE_ENV="development"
   ```

4. **Initialize Database**
   ```bash
   npx prisma migrate dev
   npx tsx prisma/seed.ts  # Seed initial categories
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   Server will start at `http://localhost:3000`.

---

## 📚 API Documentation

Interactive API documentation is available via Scalar UI when the server is running.

👉 **Visit:** `http://localhost:3000/docs`

The API covers:
- **Auth**: Login, Register, Profile
- **Catalog**: Categories, Products, Variants
- **Cart**: Add/Update/Remove items
- **Checkout**: Order placement
- **Orders**: Buyer history & Seller fulfillment views

---

## 🧪 Verification & Testing

The project includes a suite of verification scripts to ensure system integrity.

```bash
# Run all verification tests (Auth, Products, Cart, Orders)
npm run verify

# Verify specific domain
npx tsx scripts/verify-cart.ts
npx tsx scripts/verify-orders.ts
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
