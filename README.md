# 🧩 Domain-Driven Design (DDD) with Refresh Token

This project was built to study and apply **Domain-Driven Design (DDD)** principles in a practical scenario involving **authentication and refresh tokens**.

The goal is to demonstrate how to structure an application following the principles of **domain separation**, **rich entities**, **well-defined use cases**, and **repository abstractions** — ensuring low coupling and high cohesion between modules.

---

## 🎯 Purpose

The main focus of this repository is to understand how DDD can be applied in real-world use cases, particularly for secure **JWT refresh token workflows**.  
Throughout development, the following concepts were explored:

- Creation of domain entities and aggregates  
- Implementation of use cases (`use-cases`)  
- Use of interfaces for infrastructure abstraction (repositories, encryption, etc.)  
- Complete authentication flow with controlled token expiration and refresh logic  

---

## 🧠 Key Learnings

- Practical application of Domain-Driven Design (DDD) principles  
- Improved code organization and testability  
- Secure handling of JWT access and refresh tokens  
- Clear separation between domain, application, and infrastructure layers  

---

## 📦 Project Structure

The project follows a **Domain-Driven Design (DDD)** architecture, divided into clear and independent layers to promote scalability, maintainability, and testability.

```bash
src
├── core/
│   └── entities/                # Core domain utilities and base entities
│
├── domain/
│   └── login/                   # Domain related to authentication and login
│       ├── application/         # Application layer (use cases, services, repositories, cryptography)
│       └── enterprise/          # Domain entities (User, RefreshToken, etc.)
│
├── infra/                       # Infrastructure layer (adapters and external implementations)
│   ├── auth/                    # Auth module configuration
│   ├── cryptography/            # JWT and encryption implementations
│   ├── database/                # Database setup and Prisma integration
│   ├── env/                     # Environment variable management
│   ├── http/                    # HTTP layer (controllers, routes)
│   └── app.module.ts            # Root module for NestJS
│
├── test/                        # Unit and integration tests
│
├── main.ts                      # Application entry point
```

---

## 🧱 Layer Overview

### **Core**
Contains fundamental building blocks and base classes shared across the project.

### **Domain**
The heart of the business logic — entities, value objects, and use cases live here.  
This layer is fully independent from frameworks and external libraries.

### **Infra**
Infrastructure implementations (database, JWT, HTTP, etc.) that fulfill contracts defined in the domain layer.

### **Test**
Contains unit and end-to-end (E2E) tests to validate both domain and infrastructure behavior.

---

## 🚀 Getting Started

### **1. Clone the repository**
```bash
git clone https://github.com/your-username/ddd-refresh-token.git
cd ddd-refresh-token
```

### **2. Clone the repository**
```bash
npm install
# or
yarn install
```

### **3. Setup environment variables**
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/yourdb"
JWT_SECRET="your_jwt_secret"
```

### **5. Run docker compose**
```bash
docker compose up -d
```

### **6. Run database migrations**
```bash
npx prisma migrate dev --name init
# or for production
npx prisma migrate deploy
```

### **7. Start the development server**
```bash
npm run dev
# or
yarn dev
```