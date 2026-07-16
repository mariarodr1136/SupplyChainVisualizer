# Nexus: Supply Chain Visualizer ⛓️

[![CI](https://github.com/mariarodr1136/SupplyChainVisualizer/actions/workflows/ci.yml/badge.svg)](https://github.com/mariarodr1136/SupplyChainVisualizer/actions/workflows/ci.yml) ![React](https://img.shields.io/badge/React-Frontend-61DAFB) ![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F) ![Java](https://img.shields.io/badge/Java-17-007396) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791) ![Flyway](https://img.shields.io/badge/Flyway-Migrations-CC0200) ![Chart.js](https://img.shields.io/badge/Chart.js-Visualization-FF6384) ![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900) ![Bootstrap](https://img.shields.io/badge/Bootstrap-Styling-7952B3) ![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED) ![Render](https://img.shields.io/badge/Render-Deployment-46E3B7)

The **Supply Chain Visualizer** is a comprehensive **web application** designed to provide powerful visualization and analysis of supply chain networks. By combining **React** frontend technology with a robust **Spring Boot/Java backend**, this platform enables businesses to **interactively map their supply chains**, **track inventory levels**, and **monitor shipment status** in real-time. 

The application provides actionable insights through **performance metrics** and **data visualizations**, allowing users to identify bottlenecks and opportunities for optimization. With a user-friendly interface integrating **Leaflet maps** and **Chart.js visualizations**, the Supply Chain Visualizer transforms complex supply chain data into accessible, meaningful information.

The ultimate goal is to equip businesses with the **analytical tools** and **visual insights** needed to strengthen their supply chain resilience, improve operational efficiency, and make data-driven decisions in an increasingly complex global logistics environment. 🚚📊

---

Live Application: https://supply-chain-visualizer.onrender.com

*Note: The live application is hosted on Render’s free tier, so the backend may take 1–2 minutes to wake up on the first visit after inactivity. If the page loads slowly when creating a new user, please be patient while the server starts.*

---

<img width="1463" height="797" alt="Screenshot 2026-07-15 at 2 42 01 PM" src="https://github.com/user-attachments/assets/222fbab8-6ad9-43c2-9971-c94904035dcd" />

---

<img width="1470" height="801" alt="Screenshot 2026-07-15 at 2 42 14 PM" src="https://github.com/user-attachments/assets/e21d3b93-a4dc-4a08-97b5-ebae6241e7b7" />

---

### Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#getting-started)
- [Project Structure](#project-structure)
- [Core Components](#-core-components)
- [Experience & UI](#-experience--ui)
- [Demo & Guest Mode](#-demo--guest-mode)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#contributing)
- [Contact](#contact-)

---

### Features:

- **Supply Chain Map**: Visualize your supply chain network with an interactive map
- **Inventory Dashboard**: Track inventory levels across facilities
- **Shipment Tracker**: Monitor shipment status and delivery timelines
- **Performance Metrics**: View key performance indicators for your supply chain
- **Data Management**: Add and update supply chain nodes, connections, and inventory data
- **Basic Optimization**: Get suggestions for improving your supply chain efficiency
- **Analytics Workspace**: Real KPIs (on‑time rate, avg lead time, exception rate), SLA by lane, and lead‑time variance computed from live shipment data
- **Forecasting Suite**: Demand forecasts and safety stock guidance sourced from real inventory levels; seasonality signals for upcoming months
- **Live Alerts Feed**: Auto-refreshing feed (every 30 s) of delayed shipments and low-stock alerts pulled from live data
- **Orders Hub**: Purchase/sales order lifecycle visibility
- **Network Connections**: Dedicated view to manage and analyze transport links
- **Guest Mode**: Instant demo access via the login page — pre-filled credentials and a single click to explore the full platform

---

<img width="1470" height="798" alt="Screenshot 2026-07-15 at 2 44 21 PM" src="https://github.com/user-attachments/assets/86ca81d9-bb6b-472b-866b-6ded1f8d9ab5" />

---

<img width="1470" height="796" alt="Screenshot 2026-07-15 at 2 43 11 PM" src="https://github.com/user-attachments/assets/8fd23b74-31a2-4d1a-9f12-0e18ab2e30b0" />

---

### Technology Stack:

#### Frontend (Interactive UI + Visualization)
- **React 18 + Vite** (SPA architecture, component-driven UI, instant dev server)
- **JavaScript (ES6+)** (modern async patterns and state management)
- **Chart.js** (KPI and trend visualizations)
- **Leaflet** (geospatial mapping and network overlays)
- **Bootstrap** (responsive layout and UI primitives)
- **Axios** (REST client with JWT auth headers)
- **Vitest + React Testing Library** (unit and component tests)

#### Backend (API + Security)
- **Java 17 + Spring Boot 3.5** (REST services, service-layer architecture)
- **Spring Data JPA + Hibernate** (ORM + repository pattern)
- **Spring Security + JWT** (stateless authentication)
- **springdoc-openapi** (live Swagger UI documentation)
- **RESTful API Design** (resource-first endpoints)

#### Data Layer
- **PostgreSQL** (relational persistence, indexed queries — local & Docker stack)
- **Flyway** (versioned schema migrations + idempotent seed data)
- **H2 (embedded)** (file-based `h2` profile powering the free-tier live demo)

#### Deployment & DevOps
- **Docker** (multi-stage builds for optimized images)
- **Render Blueprint (IaC)** (repeatable cloud deployment)
- **GitHub Actions CI** (backend + frontend test suites on every push)
- **Git/GitHub** (source control + release workflow)
- **Environment-based configuration** (no hardcoded secrets)

---

### Getting Started:

#### Prerequisites
- Node.js (v18+)
- Java 17+ with Maven
- PostgreSQL
- Git

> **Shortcut:** if you have Docker installed, `docker-compose up -d` starts the full stack (PostgreSQL + API + frontend) with no other setup — see [Local Deployment with Docker](#local-deployment-with-docker).

#### Setting Up the Backend:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mariarodr1136/SupplyChainVisualizer.git
   cd SupplyChainVisualizer
   ```

2. **Set up the database**:
   ```bash
   # Create a PostgreSQL database
   createdb supply_chain_db
   ```

3. **Configure database connection**:
   ```bash
   # Edit the application.properties file
   nano backend/supply-chain-visualizer/src/main/resources/application.properties
   ```

4. **Build and run the backend**:
   ```bash
   cd backend
   cd supply-chain-visualizer
   mvn clean install
   mvn spring-boot:run
   ```
   The backend server will start on http://localhost:8080, and Flyway will create the schema and seed data automatically.

#### Setting Up the Frontend

1. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

2. **Start the development server** (Vite, with `/api` proxied to the backend):
   ```bash
   npm start
   ```

3. **Access the application** at http://localhost:3000

---

https://github.com/user-attachments/assets/cdb73316-14ee-4195-8ec5-0dd58340bedd

---

### Project Structure

```
supply-chain-visualizer/
├── frontend/                   # React frontend (Vite)
│   ├── index.html              # Vite entry HTML
│   ├── vite.config.js          # Dev server, proxy, build, and test config
│   ├── Dockerfile              # Multi-stage build served by nginx
│   └── src/
│       ├── components/         # Reusable components
│       ├── pages/              # Page components
│       ├── services/           # API services (with guest-mode fallback)
│       ├── context/            # React context providers
│       ├── data/               # Static in-memory dataset for guest mode
│       ├── App.jsx             # Main App component
│       └── main.jsx            # Entry point
│
├── backend/
│   └── supply-chain-visualizer/    # Java Spring Boot backend
│       ├── Dockerfile              # Multi-stage Docker build
│       ├── entrypoint.sh           # Container startup script
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   ├── config/     # OpenAPI (Swagger) config
│       │   │   │   ├── controller/ # API controllers
│       │   │   │   ├── dto/        # Data Transfer Objects
│       │   │   │   ├── exception/  # Global exception handler
│       │   │   │   ├── model/      # Entity models
│       │   │   │   ├── repository/ # JPA repositories
│       │   │   │   ├── security/   # JWT and security config
│       │   │   │   └── service/    # Business logic
│       │   │   └── resources/
│       │   │       ├── application.properties         # Local config (PostgreSQL)
│       │   │       ├── application-h2.properties      # Live demo config (embedded H2)
│       │   │       ├── application-render.properties  # Postgres-backed production config
│       │   │       └── db/migration/                  # Flyway migrations (schema + seed)
│       │   └── test/               # 57 unit tests: NodeService, ProductService, InventoryService, ShipmentService, AnalyticsService, JwtUtils
│       └── pom.xml                 # Maven dependencies
│
├── .github/workflows/ci.yml   # CI: backend + frontend tests on every push
├── docker-compose.yml          # Local full-stack: PostgreSQL + API + frontend
├── render.yaml                 # Render Blueprint (IaC)
├── .gitignore                  # Git ignore file
└── README.md                   # Project documentation
```

---

### 📊 Core Components

| Component | What It Covers |
|---|---|
| **Supply Chain Map** | Facility nodes, transport connections, and performance status overlays |
| **Inventory Dashboard** | Stock levels by location, thresholds, and low‑stock visibility |
| **Shipment Tracker** | Active shipments, timelines, and delivery status |
| **Performance Metrics** | On‑time delivery, turnover, fulfillment time, and cost KPIs |
| **Analytics Workspace** | SLA compliance, cost trends, and lead‑time variance |
| **Forecasting Suite** | Demand forecasts, seasonality signals, and safety stock guidance |
| **Live Alerts Feed** | Exceptions, delays, and operational risk signals |
| **Orders Hub** | Purchase/sales order lifecycle tracking |

---

### 🧭 Experience & UI

- **Dark‑mode dashboard styling** for long‑session readability
- **Sticky header + guest banner** to keep session context visible
- **Consistent toolbar layout** with balanced spacing and sizing
- **Dark modals & popups** for uniform contrast in overlays
- **Dark map tiles** with tuned contrast for clearer geospatial focus

---

### 🧪 Demo & Guest Mode

The app is designed for easy recruiter and stakeholder walkthroughs — no account creation needed:
- **Marketing landing page** introduces the platform before asking for any login
- **Pre-filled demo credentials** on the login page (`guest` / `guest`) — read-only, one click to enter
- **Prominent orange "Sign In for Free Demo" button** makes the entry point unmissable
- **Static in‑memory dataset** (nodes, products, inventory, shipments, connections) powers the guest session
- **Safe experimentation**: changes are session‑scoped and reset on refresh

---

<img width="1411" height="763" alt="Screenshot 2026-07-15 at 2 42 31 PM" src="https://github.com/user-attachments/assets/07b7fba7-f16d-42bf-b545-2491e94466b9" />


---

### 🧪 Testing

Both test suites run automatically in **GitHub Actions CI** on every push and pull request.

#### Backend

The backend includes a suite of **57 unit tests** covering the core service and security layers, written with JUnit 5, Mockito, and AssertJ.

| Test Class | Coverage |
|---|---|
| `NodeServiceImplTest` | CRUD ops, filter by type/status — 11 tests |
| `ProductServiceImplTest` | CRUD ops, filter by status, lookup by SKU — 12 tests |
| `InventoryServiceImplTest` | CRUD ops, status thresholds (critical/low/optimal/excess) — 11 tests |
| `ShipmentServiceImplTest` | Status transitions, inventory adjustment on delivery — 8 tests |
| `AnalyticsServiceImplTest` | On-time rate, exception rate, avg lead time, SLA by lane, lead-time variance — 8 tests |
| `JwtUtilsTest` | Token generation, username extraction, validation (valid/expired/malformed) — 7 tests |

Run the full suite from the backend directory:

```bash
cd backend/supply-chain-visualizer
mvn test
```

#### Frontend

The frontend uses **Vitest + React Testing Library** for the service layer (guest-mode vs. API branching, auth headers, analytics KPIs) and component rendering:

```bash
cd frontend
npm test
```

---

### 📝 API Documentation

Interactive **Swagger UI** is available at [`/swagger-ui.html`](http://localhost:8080/swagger-ui.html) when the backend is running (generated by springdoc-openapi, with JWT bearer auth support via the **Authorize** button). The raw OpenAPI spec is served at `/v3/api-docs`.

This section describes how to authenticate and interact with the Supply Chain Visualizer backend.

---

## 1. Authentication

### 1.1 Register a User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "<your_username>",
  "email":    "<your_email>",
  "password": "<your_password>"
}
```

### 1.2 Login to Obtain JWT

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "<your_username>",
  "password": "<your_password>"
}
```

<details>
<summary>Sample Response</summary>

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 3,
  "username": "james",
  "email": "james@gmail.com",
  "roles": ["ROLE_USER"]
}
```

</details>

### 1.3 Set Authorization Header

Include the JWT in the `Authorization` header for all protected requests:

```
Authorization: Bearer <your_token_here>
```

---

## 2. Endpoints Overview

| Category             | Method | Endpoint                        | Description                         |
|----------------------|--------|---------------------------------|-------------------------------------|
| **Nodes**            | GET    | `/api/nodes`                    | List all supply chain nodes        |
|                      | GET    | `/api/nodes/:id`                | Retrieve a specific node           |
|                      | POST   | `/api/nodes`                    | Create a new node                  |
|                      | PUT    | `/api/nodes/:id`                | Update an existing node            |
|                      | DELETE | `/api/nodes/:id`                | Delete a node                      |
| **Connections**      | GET    | `/api/connections`              | List all connections               |
|                      | POST   | `/api/connections`              | Create a new connection            |
|                      | PUT    | `/api/connections/:id`          | Update a connection                |
|                      | DELETE | `/api/connections/:id`          | Delete a connection                |
| **Inventory**        | GET    | `/api/inventory`                | List inventory across all nodes    |
|                      | GET    | `/api/inventory/node/:nodeId`   | Inventory for a specific node      |
|                      | GET    | `/api/inventory/low-stock`      | List items at or below threshold   |
|                      | POST   | `/api/inventory`                | Add or update inventory data       |
| **Shipments**        | GET    | `/api/shipments`                | List all shipments                 |
|                      | GET    | `/api/shipments/:id`            | Retrieve a specific shipment       |
|                      | POST   | `/api/shipments`                | Create a new shipment              |
|                      | PUT    | `/api/shipments/:id`            | Update a shipment                  |
|                      | PUT    | `/api/shipments/status/:id`     | Update shipment status             |
| **Products**         | POST   | `/api/products`                 | Create a new product               |
|                      | GET    | `/api/products`                 | List all products                  |
|                      | GET    | `/api/products/sku/:sku`        | Retrieve a product by SKU          |
|                      | PUT    | `/api/products/:id`             | Update a product                   |
|                      | DELETE | `/api/products/:id`             | Delete a product                   |
| **Analytics**        | GET    | `/api/analytics/summary`        | KPIs, SLA by lane, lead-time variance |

---


## 3. Sample Requests

### 3.1 Create a Supply Chain Node

```bash
POST /api/nodes
Content-Type: application/json
Authorization: Bearer <your_token_here>

{
  "name":      "Warehouse Alpha",
  "type":      "warehouse",
  "latitude":  25.7617,
  "longitude": -80.1918,
  "capacity":  1000,
  "status":    "active"
}
```

### 3.2 Create a Connection

```bash
POST /api/connections
Content-Type: application/json
Authorization: Bearer <your_token_here>

{
  "sourceId":          1,
  "targetId":          2,
  "transportationType": "truck",
  "distance":           300.5,
  "travelTime":         6,
  "costPerUnit":        2.75,
  "status":             "active"
}
```

### 3.3 Update Inventory Data

```bash
POST /api/inventory
Content-Type: application/json
Authorization: Bearer <your_token_here>

{
  "nodeId":       1,
  "productId":    10,
  "quantity":     500,
  "minThreshold": 100,
  "maxThreshold": 1000
}
```

### 3.4 Create a Shipment

```bash
POST /api/shipments
Content-Type: application/json
Authorization: Bearer <your_token_here>

{
  "sourceId":          1,
  "destinationId":     2,
  "status":            "in_transit",
  "departureDate":     "2025-04-20",
  "estimatedArrival":  "2025-04-21",
  "actualArrival":     null,
  "items": [
    { "productId": 101, "quantity": 50 },
    { "productId": 102, "quantity": 75 }
  ]
}
```

### 3.5 Create a Product

```bash
POST /api/products
Content-Type: application/json
Authorization: Bearer <your_token_here>

{
  "name": "Laptop Model X",
  "description": "High performance laptop",
  "unitPrice": 999.99,
  "weight": 2.5,
  "sku": "LT-X-001",
  "status": "active"
}
```

### 3.6 Get All Products

```bash
GET /api/products
Authorization: Bearer <your_token_here>
```

### 3.7 Get Product by SKU

```bash
GET /api/products/sku/LT-X-001
Authorization: Bearer <your_token_here>
```

### 3.8 Get Analytics Summary

```bash
GET /api/analytics/summary
Authorization: Bearer <your_token_here>
```

<details>
<summary>Sample Response</summary>

```json
{
  "onTimeDeliveryRate": 93.4,
  "avgLeadTimeDays": 4.6,
  "exceptionRate": 2.1,
  "totalShipments": 48,
  "deliveredShipments": 41,
  "slaByLane": [
    { "lane": "Pacific Components Factory → Central Warehouse", "slaRate": 96.0 },
    { "lane": "Central Warehouse → Northeast DC", "slaRate": 88.0 }
  ],
  "leadTimeBySegment": [
    { "segment": "Factory → Warehouse", "targetDays": 3.5, "actualDays": 4.1, "variance": "+0.6" }
  ]
}
```

</details>

---

### 🚢 Deployment

#### Live Demo on Render

The application is deployed on **Render** using a Blueprint (`render.yaml`) for Infrastructure as Code:

- **Backend**: Dockerized Spring Boot API deployed as a Render Web Service
- **Frontend**: React static site built and served via Render Static Site
- **Database**: Embedded file-based H2 (`h2` profile) running inside the backend service — the free-tier demo needs no managed database

##### How It Works
The project uses a `render.yaml` Blueprint that provisions both services in one click:
1. The **backend** is built using a multi-stage Dockerfile (Maven build → JRE runtime) and runs with `SPRING_PROFILES_ACTIVE=h2`, so the demo persists to an embedded H2 database instead of a paid managed instance
2. To run against **PostgreSQL** instead, switch the profile to `render` and attach a database — `entrypoint.sh` automatically parses Render's connection string into JDBC-compatible components
3. The **frontend** is built with `npm run build` and served as a static site with client-side routing support
4. **Environment variables** handle all sensitive configuration (JWT secrets, CORS origins, database credentials) — no secrets are hardcoded or committed to version control

##### Deploy Your Own Instance
1. Fork this repository
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect your forked repository — Render auto-detects `render.yaml`
4. Click **Apply** to provision all services
5. After deployment, update `CORS_ALLOWED_ORIGINS` on the backend and `VITE_API_URL` on the frontend to match the actual Render-assigned URLs

#### Local Deployment with Docker
The included `docker-compose.yml` provisions the full stack locally — PostgreSQL, the Spring Boot API (with Flyway migrations), and the frontend served by nginx:
```bash
# Build and start the containers
docker-compose up -d

# Frontend: http://localhost:3000 | API: http://localhost:8080 | Swagger: http://localhost:8080/swagger-ui.html
```
---

#### A Note on Data

Registered accounts share a single demo workspace — nodes, shipments, and inventory are common to all users, which keeps the live demo populated and interactive. Because the live demo runs on an embedded database, shared data may reset when the service is redeployed. Guest mode is fully isolated: it runs on an in-memory dataset in the browser and resets on refresh.

---

### Contributing 
Feel free to submit issues or pull requests for improvements or bug fixes. You can also open issues to discuss potential changes or enhancements. All contributions are welcome to enhance the app’s features or functionality!

To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feat/your-feature-name
- Alternatively, for bug fixes:
   ```bash
   git checkout -b fix/your-bug-fix-name
3. Make your changes and run all tests before committing the changes and make sure all tests are passed.
4. After all tests are passed, commit your changes with descriptive messages:
   ```bash
   git commit -m 'add your commit message'
5. Push your changes to your forked repository:
   ```bash
   git push origin feat/your-feature-name.
6. Submit a pull request to the main repository, explaining your changes and providing any necessary details.

---

### Contact 🌐
If you have any questions or feedback, feel free to reach out at [mrodr.contact@gmail.com](mailto:mrodr.contact@gmail.com).
