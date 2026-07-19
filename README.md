# Nexus: Supply Chain Visualizer 🚛⛓️‍💥

[![CI](https://github.com/mariarodr1136/SupplyChainVisualizer/actions/workflows/ci.yml/badge.svg)](https://github.com/mariarodr1136/SupplyChainVisualizer/actions/workflows/ci.yml) ![React](https://img.shields.io/badge/React-18-61DAFB) ![Java](https://img.shields.io/badge/Java-17-007396) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791) ![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED) ![Render](https://img.shields.io/badge/Render-Deployed-46E3B7)

A full-stack web application for mapping and analyzing supply chain networks — interactive geospatial maps, live inventory and shipment tracking, and analytics computed from real operational data. Businesses can visualize their entire network on a map, monitor stock levels and deliveries in real time, and surface bottlenecks through KPIs, forecasts, and a live alerts feed.

Built end-to-end with a **React 18** frontend and a **Spring Boot 3.5 / Java 17** REST API, secured with stateless **JWT** authentication, backed by **PostgreSQL** with versioned **Flyway** migrations, covered by CI-run test suites on both tiers, and deployed with **Docker** on **Render** via Infrastructure as Code.

Live Demo: [supply-chain-visualizer.onrender.com](https://supply-chain-visualizer.onrender.com)

> Hosted on Render's free tier — the backend may take 1–2 minutes to wake on first visit.

---

<img width="1463" height="797" alt="Dashboard" src="https://github.com/user-attachments/assets/222fbab8-6ad9-43c2-9971-c94904035dcd" />

<img width="1470" height="801" alt="Supply chain map" src="https://github.com/user-attachments/assets/e21d3b93-a4dc-4a08-97b5-ebae6241e7b7" />

---

### Table of Contents

- [Features](#features)
- [Engineering Highlights](#engineering-highlights)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Contact](#contact)

---

### Features

- **Interactive Supply Chain Map** — facility nodes and transport connections on Leaflet with performance overlays
- **Inventory Dashboard** — stock levels by location with critical/low/optimal/excess thresholds
- **Shipment Tracker** — status transitions with automatic inventory adjustment on delivery
- **Analytics Workspace** — on-time rate, average lead time, exception rate, SLA by lane, and lead-time variance computed from live shipment data
- **Forecasting Suite** — demand forecasts, seasonality signals, and safety stock guidance from real inventory levels
- **Live Alerts Feed** — auto-refreshing feed of delayed shipments and low-stock alerts
- **Orders Hub & Network Connections** — order lifecycle visibility and transport link management
- **Guest Mode** — one-click, read-only demo backed by an in-memory dataset; changes reset on refresh
- **Polished dark UI** — custom dark theme across dashboards, modals, and map tiles, designed for long-session readability

### Engineering Highlights

- **Layered backend architecture** — controllers, DTOs, service interfaces with implementations, and JPA repositories, plus a global exception handler for consistent API errors
- **Stateless security** — Spring Security + JWT with token generation, validation, and role-based access; secrets injected via environment variables, never committed
- **Guest mode without a backend** — the frontend service layer transparently falls back to a static in-memory dataset, so the demo works instantly even while the free-tier server cold-starts
- **Database as code** — Flyway versioned migrations create the schema and idempotent seed data automatically on startup, across three runtime profiles (local PostgreSQL, embedded H2 demo, managed Postgres in production)
- **Modernized, not greenfield** — migrated the stack from Java 11 / Spring Boot 2.7 / Create React App to Java 17 / Spring Boot 3.5 / Vite, adding Flyway, OpenAPI docs, and security hardening along the way
- **Automated quality gates** — 72 automated tests (57 backend unit tests + 15 frontend Vitest tests) run in GitHub Actions on every push
- **Reproducible deployment** — multi-stage Docker builds, a one-command local stack via Docker Compose, and a Render Blueprint that provisions the entire cloud environment in one click

<img width="1470" height="798" alt="Analytics" src="https://github.com/user-attachments/assets/86ca81d9-bb6b-472b-866b-6ded1f8d9ab5" />

<img width="1470" height="796" alt="Shipments" src="https://github.com/user-attachments/assets/8fd23b74-31a2-4d1a-9f12-0e18ab2e30b0" />

---

### Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 + Vite, Chart.js, Leaflet, Bootstrap, Axios |
| **Backend** | Java 17, Spring Boot 3.5, Spring Data JPA, Spring Security + JWT, springdoc-openapi |
| **Database** | PostgreSQL with Flyway migrations (embedded H2 profile for the free-tier demo) |
| **DevOps** | Docker multi-stage builds, GitHub Actions CI, Render Blueprint (IaC) |

---

### Quick Start

With Docker, one command runs the full stack (PostgreSQL + API + frontend):

```bash
git clone https://github.com/mariarodr1136/SupplyChainVisualizer.git
cd SupplyChainVisualizer
docker-compose up -d
# Frontend: http://localhost:3000 | API: http://localhost:8080 | Swagger: http://localhost:8080/swagger-ui.html
```

<details>
<summary><b>Manual setup (without Docker)</b></summary>

**Prerequisites:** Node.js 18+, Java 17+ with Maven, PostgreSQL

```bash
# Backend — Flyway creates the schema and seed data automatically
createdb supply_chain_db
cd backend/supply-chain-visualizer
mvn spring-boot:run          # http://localhost:8080

# Frontend (in a second terminal)
cd frontend
npm install
npm start                    # http://localhost:3000
```

Database credentials are configured in `backend/supply-chain-visualizer/src/main/resources/application.properties`.

</details>

---

https://github.com/user-attachments/assets/cdb73316-14ee-4195-8ec5-0dd58340bedd

---

### Architecture

```
frontend/                      # React SPA (Vite) — components, pages, services with guest-mode fallback
backend/supply-chain-visualizer/
  └── src/main/java/           # Controllers → Services → JPA Repositories, JWT security, OpenAPI config
  └── src/main/resources/      # Profile-based config + Flyway migrations (schema + seed)
.github/workflows/ci.yml       # Backend + frontend test suites on every push
docker-compose.yml             # Local full stack
render.yaml                    # Render Blueprint (Infrastructure as Code)
```

- **REST API** with resource-first endpoints for nodes, connections, inventory, shipments, products, and analytics
- **Stateless JWT authentication** via Spring Security; no secrets in source — all sensitive config comes from environment variables
- **Interactive API docs**: Swagger UI at [`/swagger-ui.html`](http://localhost:8080/swagger-ui.html) with JWT bearer auth support (raw OpenAPI spec at `/v3/api-docs`)

<details>
<summary><b>Full project structure</b></summary>

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
│       │   └── test/               # 57 unit tests across services and security
│       └── pom.xml                 # Maven dependencies
│
├── .github/workflows/ci.yml   # CI: backend + frontend tests on every push
├── docker-compose.yml          # Local full-stack: PostgreSQL + API + frontend
└── render.yaml                 # Render Blueprint (IaC)
```

</details>

<details>
<summary><b>API endpoints overview</b></summary>

Authenticate via `POST /api/auth/register` and `POST /api/auth/login`, then send the returned JWT on protected requests: `Authorization: Bearer <token>`.

| Category | Method | Endpoint | Description |
|---|---|---|---|
| **Nodes** | GET | `/api/nodes` | List all supply chain nodes |
| | GET | `/api/nodes/:id` | Retrieve a specific node |
| | POST | `/api/nodes` | Create a new node |
| | PUT | `/api/nodes/:id` | Update an existing node |
| | DELETE | `/api/nodes/:id` | Delete a node |
| **Connections** | GET | `/api/connections` | List all connections |
| | POST | `/api/connections` | Create a new connection |
| | PUT | `/api/connections/:id` | Update a connection |
| | DELETE | `/api/connections/:id` | Delete a connection |
| **Inventory** | GET | `/api/inventory` | List inventory across all nodes |
| | GET | `/api/inventory/node/:nodeId` | Inventory for a specific node |
| | GET | `/api/inventory/low-stock` | List items at or below threshold |
| | POST | `/api/inventory` | Add or update inventory data |
| **Shipments** | GET | `/api/shipments` | List all shipments |
| | GET | `/api/shipments/:id` | Retrieve a specific shipment |
| | POST | `/api/shipments` | Create a new shipment |
| | PUT | `/api/shipments/:id` | Update a shipment |
| | PUT | `/api/shipments/status/:id` | Update shipment status |
| **Products** | GET | `/api/products` | List all products |
| | GET | `/api/products/sku/:sku` | Retrieve a product by SKU |
| | POST | `/api/products` | Create a new product |
| | PUT | `/api/products/:id` | Update a product |
| | DELETE | `/api/products/:id` | Delete a product |
| **Analytics** | GET | `/api/analytics/summary` | KPIs, SLA by lane, lead-time variance |

Request/response schemas and a live sandbox are available in Swagger UI.

</details>

<details>
<summary><b>A note on demo data</b></summary>

Registered accounts share a single demo workspace — nodes, shipments, and inventory are common to all users, which keeps the live demo populated and interactive. Because the live demo runs on an embedded database, shared data may reset when the service is redeployed. Guest mode is fully isolated: it runs on an in-memory dataset in the browser and resets on refresh.

</details>

---

### Testing

**72 automated tests** run in **GitHub Actions CI** on every push. The **57 backend unit tests** (JUnit 5, Mockito, AssertJ) cover the service and security layers — CRUD and filtering, inventory thresholds, shipment status transitions, analytics KPI calculations, and JWT generation/validation. The **15 frontend tests** (Vitest + React Testing Library) cover the service layer — including the guest-mode fallback — and shared components.

```bash
cd backend/supply-chain-visualizer && mvn test   # backend
cd frontend && npm test                          # frontend
```

<details>
<summary><b>Backend test coverage by class</b></summary>

| Test Class | Coverage |
|---|---|
| `NodeServiceImplTest` | CRUD ops, filter by type/status — 11 tests |
| `ProductServiceImplTest` | CRUD ops, filter by status, lookup by SKU — 12 tests |
| `InventoryServiceImplTest` | CRUD ops, status thresholds (critical/low/optimal/excess) — 11 tests |
| `ShipmentServiceImplTest` | Status transitions, inventory adjustment on delivery — 8 tests |
| `AnalyticsServiceImplTest` | On-time rate, exception rate, avg lead time, SLA by lane, lead-time variance — 8 tests |
| `JwtUtilsTest` | Token generation, username extraction, validation (valid/expired/malformed) — 7 tests |

</details>

---

### Deployment

Deployed on **Render** via a one-click Blueprint (`render.yaml`):

- **Backend** — Dockerized Spring Boot API (multi-stage Maven → JRE build) running as a web service; the free-tier demo persists to embedded H2, and switching the profile to `render` with an attached database runs it against managed PostgreSQL (`entrypoint.sh` parses Render's connection string into JDBC components automatically)
- **Frontend** — React production build served as a static site with client-side routing support
- **Configuration** — JWT secrets, CORS origins, and database credentials all come from environment variables

To deploy your own instance: fork the repo, create a new Blueprint in the [Render Dashboard](https://dashboard.render.com) (it auto-detects `render.yaml`), and update the CORS/API URL environment variables after provisioning.

---

### Contributing

Issues and pull requests are welcome — feel free to open an issue first to discuss larger changes.

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature-name` (or `fix/...` for bug fixes)
3. Make your changes and ensure both test suites pass
4. Commit with a descriptive message and push to your fork
5. Open a pull request explaining your changes

### Contact

**Maria Rodriguez** — [mrodr.contact@gmail.com](mailto:mrodr.contact@gmail.com)
