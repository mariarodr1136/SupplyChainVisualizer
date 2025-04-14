# Supply Chain Visualizer ⛓️

The **Supply Chain Visualizer** is a comprehensive **web application** designed to provide powerful visualization and analysis of supply chain networks. By combining **React** frontend technology with a robust **Spring Boot/Java backend**, this platform enables businesses to **interactively map their supply chains**, **track inventory levels**, and **monitor shipment status** in real-time. The application provides actionable insights through **performance metrics** and **data visualizations**, allowing users to identify bottlenecks and opportunities for optimization. With a user-friendly interface integrating **Leaflet maps** and **Chart.js visualizations**, the Supply Chain Visualizer transforms complex supply chain data into accessible, meaningful information.

The ultimate goal is to equip businesses with the **analytical tools** and **visual insights** needed to strengthen their supply chain resilience, improve operational efficiency, and make data-driven decisions in an increasingly complex global logistics environment. 🚚📊

---

![React](https://img.shields.io/badge/React-Frontend-61DAFB) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F) ![Java](https://img.shields.io/badge/Java-Programming_Language-007396) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791) ![Chart.js](https://img.shields.io/badge/Chart.js-Visualization-FF6384) ![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900) ![Bootstrap](https://img.shields.io/badge/Bootstrap-Styling-7952B3)

---

<img width="1459" alt="Screenshot 2025-04-13 at 7 27 45 PM" src="https://github.com/user-attachments/assets/fdd400b2-4966-49f3-a4cb-e4109f0ff6c5" />
<img width="1456" alt="Screenshot 2025-04-13 at 7 31 33 PM" src="https://github.com/user-attachments/assets/3a0e855b-7949-4e37-9373-4957f8803532" />

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
   The backend server will start on http://localhost:8080

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

### 📝 API Documentation

The backend provides the following key API endpoints:

#### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration

#### Supply Chain Nodes
- `GET /api/nodes`: Get all supply chain nodes
- `GET /api/nodes/:id`: Get a specific node
- `POST /api/nodes`: Create a new node
- `PUT /api/nodes/:id`: Update a node
- `DELETE /api/nodes/:id`: Delete a node

#### Connections
- `GET /api/connections`: Get all connections
- `POST /api/connections`: Create a new connection
- `PUT /api/connections/:id`: Update a connection
- `DELETE /api/connections/:id`: Delete a connection

#### Inventory
- `GET /api/inventory`: Get inventory for all locations
- `GET /api/inventory/:nodeId`: Get inventory for a specific location
- `POST /api/inventory`: Update inventory data

#### Shipments
- `GET /api/shipments`: Get all shipments
- `GET /api/shipments/:id`: Get a specific shipment
- `POST /api/shipments`: Create a new shipment
- `PUT /api/shipments/:id`: Update shipment
- `PUT /api/shipments/status/:id`: Update shipment status

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
