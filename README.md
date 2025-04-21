# Supply Chain Visualizer ⛓️

The **Supply Chain Visualizer** is a comprehensive **web application** designed to provide powerful visualization and analysis of supply chain networks. By combining **React** frontend technology with a robust **Spring Boot/Java backend**, this platform enables businesses to **interactively map their supply chains**, **track inventory levels**, and **monitor shipment status** in real-time. The application provides actionable insights through **performance metrics** and **data visualizations**, allowing users to identify bottlenecks and opportunities for optimization. With a user-friendly interface integrating **Leaflet maps** and **Chart.js visualizations**, the Supply Chain Visualizer transforms complex supply chain data into accessible, meaningful information.

The ultimate goal is to equip businesses with the **analytical tools** and **visual insights** needed to strengthen their supply chain resilience, improve operational efficiency, and make data-driven decisions in an increasingly complex global logistics environment. 🚚📊

---

![React](https://img.shields.io/badge/React-Frontend-61DAFB) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F) ![Java](https://img.shields.io/badge/Java-Programming_Language-007396) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791) ![Chart.js](https://img.shields.io/badge/Chart.js-Visualization-FF6384) ![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900) ![Bootstrap](https://img.shields.io/badge/Bootstrap-Styling-7952B3)

---

<img width="1459" alt="Screenshot 2025-04-13 at 7 27 45 PM" src="https://github.com/user-attachments/assets/fdd400b2-4966-49f3-a4cb-e4109f0ff6c5" />
<img width="1463" alt="Screenshot 2025-04-21 at 9 39 21 AM" src="https://github.com/user-attachments/assets/b4dc09c4-bc41-4d2c-b2e6-7b3256f897a1" />


---


### Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#getting-started)
- [Project Structure](#project-structure)
- [Core Components](#-core-components)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Development](#-development)
- [Troubleshooting](#troubleshooting)
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

---
<img width="1459" alt="Screenshot 2025-04-21 at 9 25 05 AM" src="https://github.com/user-attachments/assets/669736d9-dfa7-46b4-96c6-843adeac9c01" />

---

### Technology Stack:

#### Frontend
- React for the user interface
- JavaScript (ES6+)
- Chart.js for data visualization
- Leaflet for map-based visualization
- Bootstrap for styling
- Axios for API requests

#### Backend
- Java with Spring Boot
- Spring Data JPA with Hibernate for ORM
- Spring Security with JWT for authentication
- RESTful API design

#### Database
- PostgreSQL

#### Deployment
- Git/GitHub for version control
- Docker for containerization (optional)
- AWS (EC2 for application hosting, S3 for static assets)

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
   git clone https://github.com/mariarodr1136/supply-chain-visualizer.git
   cd supply-chain-visualizer
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

https://github.com/user-attachments/assets/8b1563bb-08f3-49b1-86eb-8c045e089003

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
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   ├── controller/ # API controllers
│   │   │   │   ├── dto/        # Data Transfer Objects
│   │   │   │   ├── model/      # Entity models
│   │   │   │   ├── repository/ # JPA repositories
│   │   │   │   ├── security/   # JWT and security config
│   │   │   │   └── service/    # Business logic
│   │   │   └── resources/      # Configuration files
│   │   └── test/               # Test code
│   └── pom.xml                 # Maven dependencies
│
├── .gitignore                  # Git ignore file
└── README.md                   # Project documentation
```

---

### 📊 Core Components

#### Supply Chain Map
The interactive map shows your supply chain network with:
- Nodes representing facilities (factories, warehouses, stores)
- Connections showing transportation routes
- Color coding to indicate performance status

#### Inventory Dashboard
Track and manage inventory across your network:
- Current stock levels by location
- Historical inventory trends
- Low stock alerts

#### Shipment Tracker
Monitor the movement of goods:
- Active shipments with status indicators
- Delivery timelines and delays
- Historical shipment data

#### Performance Metrics
Measure the efficiency of your supply chain:
- On-time delivery rates
- Inventory turnover
- Fulfillment times
- Cost metrics

---

<img width="1458" alt="Screenshot 2025-04-13 at 8 49 36 PM" src="https://github.com/user-attachments/assets/c722fa66-72b5-4f77-850c-f8e42b126436" />

<img width="1461" alt="Screenshot 2025-04-13 at 8 49 27 PM" src="https://github.com/user-attachments/assets/d9ac64ab-3391-4e00-affb-2a1725c047ab" />

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

---

<img width="1461" alt="Screenshot 2025-04-21 at 9 25 56 AM" src="https://github.com/user-attachments/assets/e81eef55-c55f-46ca-beac-5c38a03f53df" />

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

---

### 🚢 Deployment

#### Local Deployment with Docker (Optional)
```bash
# Build and start the containers
docker-compose up -d
```

#### AWS Deployment
1. Launch an EC2 instance with appropriate security groups
2. Install dependencies (Node.js, Java, PostgreSQL)
3. Clone the repository and set up the application
4. Use a process manager like PM2 to run the application
5. Set up an Nginx reverse proxy for the frontend and API
6. (Optional) Create an S3 bucket for static assets

---

### 🔧 Development

#### Adding New Features

To add a new feature to the supply chain visualizer:

1. **Backend**: 
   - Create a new entity model
   - Create a repository interface
   - Create a service interface and implementation
   - Create a controller with REST endpoints

2. **Frontend**:
   - Create an API service
   - Create the UI components
   - Add the feature to the relevant page
   - Update the navigation as needed

#### Running Tests

```bash
# Backend tests
cd backend
cd supply-chain-visualizer
mvn test

# Frontend tests
cd frontend
npm test
```

---

### Troubleshooting

Common issues and their solutions:

- **Database connection errors**: Verify your PostgreSQL service is running and credentials are correct in application.properties
- **JWT authentication issues**: Check that the secret key is properly configured
- **CORS errors**: Ensure that the backend is properly configured to accept requests from the frontend origin

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
