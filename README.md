# Nexus: Supply Chain Visualizer ⛓️

![React](https://img.shields.io/badge/React-Frontend-61DAFB) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F) ![Java](https://img.shields.io/badge/Java-Programming_Language-007396) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791) ![Chart.js](https://img.shields.io/badge/Chart.js-Visualization-FF6384) ![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900) ![Bootstrap](https://img.shields.io/badge/Bootstrap-Styling-7952B3) ![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED) ![Render](https://img.shields.io/badge/Render-Deployment-46E3B7)

The **Supply Chain Visualizer** is a comprehensive **web application** designed to provide powerful visualization and analysis of supply chain networks. By combining **React** frontend technology with a robust **Spring Boot/Java backend**, this platform enables businesses to **interactively map their supply chains**, **track inventory levels**, and **monitor shipment status** in real-time. 

The application provides actionable insights through **performance metrics** and **data visualizations**, allowing users to identify bottlenecks and opportunities for optimization. With a user-friendly interface integrating **Leaflet maps** and **Chart.js visualizations**, the Supply Chain Visualizer transforms complex supply chain data into accessible, meaningful information.

The ultimate goal is to equip businesses with the **analytical tools** and **visual insights** needed to strengthen their supply chain resilience, improve operational efficiency, and make data-driven decisions in an increasingly complex global logistics environment. 🚚📊

---

Live Application: https://supply-chain-visualizer.onrender.com

*Note: The live application is hosted on Render’s free tier, so the backend may take 1–2 minutes to wake up on the first visit after inactivity. If the page loads slowly when creating a new user, please be patient while the server starts.*

---

<img width="1468" height="797" alt="Screenshot 2026-06-09 at 6 05 15 PM" src="https://github.com/user-attachments/assets/63c00936-4f3f-411e-8aab-05a08de96d98" />


<img width="1470" height="803" alt="Screenshot 2026-06-09 at 6 05 25 PM" src="https://github.com/user-attachments/assets/b2651c2a-eca2-4e13-a804-cb42a972c756" />


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
- **Guest Mode**: Instant demo access with seeded data for tours and presentations

---

<img width="1468" height="799" alt="Screenshot 2026-06-09 at 6 06 27 PM" src="https://github.com/user-attachments/assets/13ccc75a-ca0b-415a-af79-2041dc91c0ac" />


---

### Technology Stack:

#### Frontend (Interactive UI + Visualization)
- **React** (SPA architecture, component-driven UI)
- **JavaScript (ES6+)** (modern async patterns and state management)
- **Chart.js** (KPI and trend visualizations)
- **Leaflet** (geospatial mapping and network overlays)
- **Bootstrap** (responsive layout and UI primitives)
- **Axios** (typed REST client + auth headers)

#### Backend (API + Security)
- **Java + Spring Boot** (REST services, service-layer architecture)
- **Spring Data JPA + Hibernate** (ORM + repository pattern)
- **Spring Security + JWT** (stateless authentication)
- **RESTful API Design** (resource-first endpoints)

#### Data Layer
- **PostgreSQL** (relational persistence, indexed queries)

#### Deployment & DevOps
- **Docker** (multi-stage builds for optimized images)
- **Render Blueprint (IaC)** (repeatable cloud deployment)
- **Render PostgreSQL** (managed DB service)
- **Git/GitHub** (source control + release workflow)
- **Environment-based configuration** (no hardcoded secrets)

---

### Getting Started:

#### Prerequisites
- Node.js (v14+)
- Java 11+ with Maven
- PostgreSQL
- Git

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
   nano backend/src/main/resources/application.properties
   ```

4. **Build and run the backend**:
   ```bash
   cd backend
   cd supply-chain-visualizer
   mvn clean install
   mvn spring-boot:run
   ```
   The backend server will start on http://localhost:3000

#### Setting Up the Frontend

1. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Access the application** at http://localhost:3000

---

https://github.com/user-attachments/assets/e5d8af77-6da9-4bec-b573-b7fafea53042

---

### Project Structure

```
supply-chain-visualizer/
├── frontend/                   # React frontend
│   ├── public/                 # Static files
│   └── src/
│       ├── components/         # Reusable components
│       ├── pages/              # Page components
│       ├── services/           # API services
│       ├── context/            # React context providers
│       ├── App.js              # Main App component
│       └── index.js            # Entry point
│
├── backend/                    # Java Spring Boot backend
│   ├── Dockerfile              # Multi-stage Docker build
│   ├── entrypoint.sh           # Container startup script
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   ├── controller/ # API controllers
│   │   │   │   ├── dto/        # Data Transfer Objects
│   │   │   │   ├── model/      # Entity models
│   │   │   │   ├── repository/ # JPA repositories
│   │   │   │   ├── security/   # JWT and security config
│   │   │   │   └── service/    # Business logic
│   │   │   └── resources/
│   │   │       ├── application-render.properties  # Production config
│   │   │       └── data.sql                       # Seed data
│   │   └── test/               # 57 unit tests: NodeService, ProductService, InventoryService, ShipmentService, AnalyticsService, JwtUtils
│   └── pom.xml                 # Maven dependencies
│
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

For demos and stakeholder walkthroughs, the app supports a **Guest Mode**:
- **One‑click guest access** (no credentials required)
- **Static in‑memory dataset** (nodes, products, inventory, shipments, connections)
- **Safe experimentation**: changes are session‑scoped and reset on refresh
- **Consistent visual narrative** for rapid project overviews

---

<img width="1470" height="799" alt="Screenshot 2026-06-09 at 6 07 43 PM" src="https://github.com/user-attachments/assets/58785fcf-c718-4f6b-806c-fd9cc2554547" />

---

<img width="1470" height="800" alt="Screenshot 2026-06-09 at 6 07 53 PM" src="https://github.com/user-attachments/assets/8d4ab95b-e942-4e6e-8f33-dc94ec19245f" />

---

### 🧪 Testing

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

---

### 📝 API Documentation

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
|                      | GET    | `/api/inventory/:nodeId`        | Inventory for a specific node      |
|                      | POST   | `/api/inventory`                | Add or update inventory data       |
| **Shipments**        | GET    | `/api/shipments`                | List all shipments                 |
|                      | GET    | `/api/shipments/:id`            | Retrieve a specific shipment       |
|                      | POST   | `/api/shipments`                | Create a new shipment              |
|                      | PUT    | `/api/shipments/:id`            | Update a shipment                  |
|                      | PUT    | `/api/shipments/status/:id`     | Update shipment status             |
| **Products**         | POST   | `/api/products`                 | Create a new product               |
|                      | GET    | `/api/products`                 | List all products                  |
|                      | GET    | `/api/products/sku/:sku`        | Retrieve a product by SKU          |
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
- **Database**: Managed PostgreSQL instance on Render

##### How It Works
The project uses a `render.yaml` Blueprint that provisions all three services in one click:
1. A **PostgreSQL database** is created and connection credentials are automatically injected
2. The **backend** is built using a multi-stage Dockerfile (Maven build → JRE runtime) with an `entrypoint.sh` that parses the database connection string into JDBC-compatible components
3. The **frontend** is built with `npm run build` and served as a static site with client-side routing support
4. **Environment variables** handle all sensitive configuration (database credentials, JWT secrets, CORS origins) — no secrets are hardcoded or committed to version control

##### Deploy Your Own Instance
1. Fork this repository
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect your forked repository — Render auto-detects `render.yaml`
4. Click **Apply** to provision all services
5. After deployment, update `CORS_ALLOWED_ORIGINS` on the backend and `REACT_APP_API_URL` on the frontend to match the actual Render-assigned URLs

#### Local Deployment with Docker (Optional)
```bash
# Build and start the containers
docker-compose up -d
```
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
