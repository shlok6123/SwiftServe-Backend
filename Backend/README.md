# 🍕 SwiftServe - Food Delivery Backend

**SwiftServe** is a high-performance, stateless RESTful API built with **Spring Boot 3** and **Java 21**. It serves as the robust backbone for a food delivery ecosystem, focusing on security, scalability, and clean architectural patterns.

---

## 🛠️ Tech Stack

* **Framework:** Spring Boot 3.x (Java 21)
* **Security:** Spring Security 6, JWT (JSON Web Tokens), BCrypt Hashing
* **Database:** MySQL 8.0
* **ORM:** Spring Data JPA (Hibernate)
* **API Documentation:** springdoc-openapi (Swagger UI) and Postman
* **Other Tools:** Maven, Lombok, SLF4J (Logging)

---

## ✨ Key Features

* **Stateless Authentication:** Secure login/registration using **JWT** for high horizontal scalability and zero session overhead.
* **Role-Based Access Control (RBAC):** Specialized access for `CUSTOMER`, `RESTAURANT_OWNER`, `DRIVER`, and `ADMIN`.
* **Security Filter Chain:** Custom `OncePerRequestFilter` to validate Bearer tokens with proper `401` responses on invalid/expired tokens.
* **Global Exception Handling:** Centralized error management via `@ControllerAdvice` for standardized JSON responses.
* **Secure Storage:** Industry-grade password protection using **BCrypt** salt-hashing.
* **Configurable Driver Microservice:** Async dispatch to a Driver microservice with timeouts and best-effort failure handling.

---

## 🏗️ Architecture

The project follows a strict **Layered Architecture**:

1. **Controller Layer** – Handles HTTP requests and routes to services.
2. **Service Layer** – Core business logic, validation, and transactions.
3. **Repository Layer** – Persistence via Spring Data JPA.
4. **DTO Pattern** – Data Transfer Objects keep entities out of the wire format.

---

## 🚀 Getting Started

### Prerequisites
* **JDK 21**
* **MySQL Server 8.x**
* **Maven 3.9+**

### 1. Clone

```bash
git clone https://github.com/your-username/SwiftServe.git
cd SwiftServe/Backend
```

### 2. Configure environment

Defaults live in `src/main/resources/application.properties` and work out-of-the-box with a local MySQL on port `3306`. Override anything via environment variables:

| Variable              | Purpose                          | Default                                  |
| --------------------- | -------------------------------- | ---------------------------------------- |
| `DB_URL`              | JDBC URL                         | `jdbc:mysql://localhost:3306/swiftserve_db` |
| `DB_USERNAME`         | DB user                          | `root`                                   |
| `DB_PASSWORD`         | DB password                      | (project default)                        |
| `JWT_SECRET`          | HMAC signing key (>= 32 bytes)   | dev placeholder                          |
| `JWT_EXPIRATION_MS`   | Token lifetime in ms             | `86400000` (24h)                         |
| `DRIVER_SERVICE_URL`  | Driver microservice base URL     | `http://localhost:8081`                  |

For production, run with the `prod` profile, which requires `DB_*` and `JWT_SECRET` to be set explicitly:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### 3. Run

```bash
mvn spring-boot:run
```

On first run with an empty schema, `DatabaseSeeder` creates four demo users (password: `securepassword`):

| Email                | Role               |
| -------------------- | ------------------ |
| `customer@gmail.com` | CUSTOMER           |
| `owner@gmail.com`    | RESTAURANT_OWNER   |
| `driver@gmail.com`   | DRIVER             |
| `admin@gmail.com`    | ADMIN              |

The seeder is disabled when `prod` profile is active.

### 4. Explore

* Swagger UI: http://localhost:8080/swagger-ui.html
* OpenAPI JSON: http://localhost:8080/v3/api-docs

---

## 📡 API Surface (highlights)

| Method | Endpoint                                | Auth      | Notes                                  |
| ------ | --------------------------------------- | --------- | -------------------------------------- |
| POST   | `/api/v1/users/register`                | Public    | Register a new account                 |
| POST   | `/api/v1/users/login`                   | Public    | Returns a JWT bearer token             |
| GET    | `/api/v1/users/me`                      | JWT       | Current profile                       |
| PUT    | `/api/v1/users/profile`                 | JWT       | Update name/email                      |
| GET    | `/api/v1/restaurants/search`            | Public    | Paginated, filterable                  |
| POST   | `/api/v1/restaurants/add`               | OWNER/ADMIN | Create restaurant                    |
| PATCH  | `/api/v1/restaurants/toggle-open/{id}`  | OWNER     | Open/close shop                        |
| POST   | `/api/v1/Menu/add`                      | OWNER/ADMIN | Add menu item                        |
| POST   | `/api/v1/cart/add-item`                 | JWT       | Validated `menuItemId`/`quantity`     |
| POST   | `/api/v1/orders/checkout`               | CUSTOMER  | Convert cart to order                  |
| PUT    | `/api/v1/orders/{id}/status`            | role-aware | Customers may cancel `PENDING` orders |
| GET    | `/api/v1/admin/users`                   | ADMIN     | List all users                         |

Full request/response payloads live in `PROJECT_REPORT.md`.
