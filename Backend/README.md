# 🍕 SwiftServe - Food Delivery Backend

**SwiftServe** is a high-performance, stateless RESTful API built with **Spring Boot 3** and **Java 21**. It serves as the robust backbone for a food delivery ecosystem, focusing on security, scalability, and clean architectural patterns.

---

## 🛠️ Tech Stack

* **Framework:** Spring Boot 3.x (Java 21)
* **Security:** Spring Security 6, JWT (JSON Web Tokens), BCrypt Hashing
* **Database:** MySQL 8.0
* **ORM:** Spring Data JPA (Hibernate)
* **API Documentation:** Postman
* **Other Tools:** Maven, Lombok, SLF4J (Logging)

---

## ✨ Key Features

* **Stateless Authentication:** Implemented secure login/registration using **JWT** to ensure high horizontal scalability and zero-session overhead.
* **Role-Based Access Control (RBAC):** Configured specialized access levels for `CUSTOMER`, `RESTAURANT_OWNER`, and `ADMIN`.
* **Security Filter Chain:** Custom implementation of `OncePerRequestFilter` to intercept and validate Bearer tokens.
* **Global Exception Handling:** Centralized error management using `@ControllerAdvice` for standardized JSON API responses and system resilience.
* **Secure Data Storage:** Industrial-grade password protection using **BCrypt** salt-hashing algorithms.

---

## 🏗️ Architecture

The project follows a strict **Layered Architecture** to ensure a clean separation of concerns:

1. **Controller Layer:** Handles HTTP requests and maps them to appropriate services.
2. **Service Layer:** Contains the core business logic, validation, and data processing.
3. **Repository Layer:** Manages data persistence and MySQL interactions using JPA.
4. **DTO Pattern:** Utilized Data Transfer Objects to safely transfer data between layers without exposing internal Database Entities to the client.

---

## 🚀 Getting Started

### Prerequisites
* **JDK 17** or higher
* **MySQL Server**
* **Maven**

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/SwiftServe.git](https://github.com/your-username/SwiftServe.git)

   spring.datasource.url=jdbc:mysql://localhost:3306/swiftserve_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

mvn spring-boot:run


Method,Endpoint,Description,Auth Required
POST,/api/v1/users/register,Register a new user,No
POST,/api/v1/users/login,Login and receive JWT Token,No
GET,/api/v1/restaurants,View all available restaurants,Yes (JWT)
