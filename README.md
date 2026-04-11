# 🍔 Foodlify 

A scalable and modular backend system for a food delivery platform built to handle restaurants, orders, users, and real-time delivery operations.

---

## 📌 Overview

Foodlify is a backend service designed to power a modern food delivery application. It provides RESTful APIs for managing users, restaurants, menus, orders, and payments.

---

## 🏗️ Tech Stack

* **Backend Framework:** Node.js / Express.js/ TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT
* **Containerization:** Docker

---

## 📂 Project Structure

```
foodlify-backend/
│
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   └── logger.ts
│   │
│   ├── modules/
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       ├── user.repository.ts
│   │       ├── user.model.ts
│   │       ├── user.routes.ts
│   │       └── user.validation.ts
│   │
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   └── auth.middleware.ts
│   │
│   ├── utils/
│   │   ├── response.ts
│   │   └── asyncHandler.ts
│   │
│   ├── routes/
│   │   └── index.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
├── package.json
└── README.md
```

### 🧠 Architecture Notes

* **Modular Structure:** Each feature (e.g., `user`) follows a clean separation of concerns:

  * `controller` → handles HTTP requests
  * `service` → business logic
  * `repository` → database access
  * `model` → schema definition
  * `routes` → API routes
  * `validation` → request validation

* **TypeScript First:** All files use `.ts` with strong typing for scalability and maintainability.

* **Centralized Error Handling:** Managed via `error.middleware.ts`.

* **Reusable Utilities:** Common helpers like async handling and API responses are abstracted.

* **Environment & Logging:** Configured under `config/` for clean separation.

---

## ⚙️ Setup & Running the Application

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/foodlify-backend.git

# Navigate into the project
cd foodlify-backend

# Install dependencies
npm install
```

### ▶️ Run the App

```bash
# Development
npm run dev

# Production
npm start
```

### 🧪 Testing

```bash
npm run test
```

### 🐳 Docker

```bash
# Build image
docker build -t foodlify-backend .

# Run container
docker run -p 5000:5000 foodlify-backend
```

---

## 📡 API Endpoints

### 1- Cart Management APIs

#### 📦 Cart

* `GET    /api/v1/cart` → View cart
* `DELETE /api/v1/cart` → Clear cart
* `PUT    /api/v1/cart` → Modify entire cart

#### 🛍️ Cart Items

* `POST   /api/v1/cart/items` → Add item to cart
* `PUT    /api/v1/cart/items/:itemId` → Update quantity
* `DELETE /api/v1/cart/items/:itemId` → Remove item

#### 💳 Checkout

* `POST   /api/v1/cart/checkout` → Checkout cart

---

### 2- Authentication APIs

#### 👤 Auth

* `POST   /api/v1/auth/signup` → Register user
* `POST   /api/v1/auth/login` → Login
* `POST   /api/v1/auth/logout` → Logout

#### 🔑 Password & Verification

* `POST   /api/v1/auth/forgot-password` → Request password reset
* `POST   /api/v1/auth/reset-password` → Reset password
* `POST   /api/v1/auth/verify-otp` → Verify email/SMS OTP
* `POST   /api/v1/auth/resend-otp` → Resend OTP

#### 🌐 Social Auth

* `POST   /api/v1/auth/social` → Social login

---

## 🧪 Testing

```bash
npm run test
```

---

## 🐳 Docker Support

```bash
# Build image
docker build -t foodlify-backend .

# Run container
docker run -p 5000:5000 foodlify-backend
```

---

## 🎯 Use Cases

* User registers and logs into the platform
* User browses restaurants and menus
* User adds items to cart and modifies cart
* User places an order and tracks delivery
* Restaurant manages menus and orders
* Admin monitors system performance and transactions
* Customer makes payments using multiple methods
* Customer views order history and manages profile

---

## 📋 Detailed Features & Functions

### 👤 User Registration & Authentication

**Functions:**

* Sign up / Login / Logout
* Forgot password
* Email/OTP verification
* Social login
* Enable/Disable account
* Role-based access control (Admin, Manager, User)
* Profile management

---

### 🛒 Cart Management

**Functions:**

* Add to cart
* Modify cart
* View cart
* Clear cart
* Remove item
* Update quantities
* Checkout
* Auto-create cart per user
* Redis caching + DB persistence

---

### 🍽️ Restaurant & Menu Management

**Functions:**

* Add / Update / Enable / Disable restaurant
* Browse restaurants
* Search restaurants (filters)
* Create / Update / Delete menu
* View menu history
* Search menu items
* Top-rated & recommended restaurants

---

### 📦 Order Management

**Functions:**

* Place order
* Cancel order (customer/restaurant)
* Order tracking (status updates)
* Order history (customer & restaurant)
* Order summary & details
* Email/SMS confirmation
* Real-time notifications

---

### 👥 Customer Management

**Functions:**

* Manage profile
* Address management (multiple addresses)
* Preferred payment settings
* Order history access
* Ratings & reviews
* Customer support (chat)
* Account deactivation

---

### 💳 Payment Integration

**Functions:**

* Third-party payment integration
* Multiple payment methods
* Payment verification & validation
* Transaction tracking
* Refund handling
* Payment status tracking
* Generate receipts
* Auditing & logging

---

### 📊 Dashboard (System & Restaurant)

**Functions:**

* Count restaurants & customers
* Track orders (daily/total/cancelled)
* Monitor transactions (daily/total)
* Generate reports (daily/monthly)
* Restaurant-specific analytics

---

### 🎁 Offers & Promotions

**Functions:**

* Apply discount codes
* Manage offers
* Recommend items

---

## 📈 Future Improvements

* AI-based food recommendations
* Advanced analytics dashboard
* Multi-language support
* Delivery tracking with maps
