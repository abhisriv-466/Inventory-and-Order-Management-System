# Inventory & Order Management System

A full-stack Inventory & Order Management System built with React, FastAPI, PostgreSQL, and Docker.

The application allows businesses to manage products, customers, inventory, and orders through a responsive web interface backed by a REST API.

---

## Features

### Product Management

- Add products
- View all products
- View individual product details
- Update product details
- Delete products
- Track product price and inventory quantity
- Unique product SKU/code validation

### Customer Management

- Add customers
- View all customers
- View individual customer details
- Delete customers
- Unique customer email validation

### Order Management

- Create orders
- View all orders
- View individual order details
- Delete/cancel orders
- Select a customer
- Add one or more products to an order
- Specify quantities
- Automatically calculate order totals
- Automatically reduce inventory when an order is created
- Restore inventory when an order is deleted
- Prevent orders when insufficient stock is available

### Dashboard

The dashboard provides a summary of:

- Total products
- Total customers
- Total orders
- Low-stock products

---

## Technology Stack

### Frontend

- React
- JavaScript
- Vite
- Axios
- Nginx

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Database

- PostgreSQL

### Containerization

- Docker
- Docker Compose

### Version Control

- Git
- GitHub

---

## Project Structure

```text
Fastapi Project/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# Running the Project

There are two ways to run the application:

1. Using Docker Compose (recommended)
2. Running the frontend and backend individually during development

---

## Prerequisites

Install the following before running the project:

- Git
- Docker Desktop
- Node.js
- npm
- Python 3.x

PostgreSQL can also be installed locally for development, although the Docker Compose setup provides its own PostgreSQL container.

---

# Running with Docker Compose

Docker Compose is the recommended way to run the complete application.

The Docker Compose configuration starts:

- PostgreSQL database
- FastAPI backend
- React frontend served through Nginx

## 1. Clone the repository

```bash
git clone <GITHUB_REPOSITORY_URL>
cd <PROJECT_DIRECTORY>
```

Replace `<GITHUB_REPOSITORY_URL>` with the repository URL.

---

## 2. Configure environment variables

Create the required environment files using the provided example files.

For the backend:

```text
backend/.env
```

Use `backend/.env.example` as a reference.

Do not commit files containing real credentials to GitHub.

---

## 3. Start the application

From the project root:

```bash
docker compose up --build
```

Docker Compose will build and start:

```text
Frontend
   │
   ▼
Nginx
   │
   ▼
FastAPI Backend
   │
   ▼
PostgreSQL
```

---

## 4. Open the application

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:8000
```

FastAPI interactive API documentation:

```text
http://localhost:8000/docs
```

---

## 5. Stop the application

Press:

```text
Ctrl + C
```

or run:

```bash
docker compose down
```

To remove the PostgreSQL Docker volume as well:

```bash
docker compose down -v
```

> Warning: removing the volume deletes the PostgreSQL data stored in that Docker volume.

---

# Running Without Docker

The project can also be run manually during development.

## Backend

Create and activate a Python virtual environment:

### Windows

```powershell
python -m venv .venv
.venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r backend/requirements.txt
```

Configure the backend environment variables.

Start FastAPI:

```powershell
cd backend
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend

Open another terminal and move into the frontend directory:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# API Overview

The backend exposes REST APIs for products, customers, and orders.

## Products

| Method | Endpoint | Description |
|---|---|---|
| POST | `/products/` | Create product |
| GET | `/products/` | Retrieve all products |
| GET | `/products/{id}` | Retrieve product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |

### Product fields

- Product name
- SKU/code
- Price
- Quantity in stock

---

## Customers

| Method | Endpoint | Description |
|---|---|---|
| POST | `/customers/` | Create customer |
| GET | `/customers/` | Retrieve all customers |
| GET | `/customers/{id}` | Retrieve customer |
| DELETE | `/customers/{id}` | Delete customer |

### Customer fields

- Full name
- Email
- Phone number

---

## Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders/` | Create order |
| GET | `/orders/` | Retrieve all orders |
| GET | `/orders/{id}` | Retrieve order |
| DELETE | `/orders/{id}` | Delete/cancel order |

### Order fields

An order contains:

- Customer reference
- Product reference(s)
- Quantity ordered
- Total amount

The total amount is calculated by the backend.

---

# Business Rules

The backend implements the required inventory and order business rules.

### Product SKU uniqueness

Product SKUs must be unique.

### Customer email uniqueness

Customer email addresses must be unique.

### Inventory validation

Product inventory cannot become negative.

### Stock validation

An order cannot be created when the requested quantity exceeds available inventory.

### Automatic stock reduction

Creating an order automatically reduces the corresponding product inventory.

### Automatic order total

The backend calculates the total order amount based on product prices and quantities.

### Stock restoration

When an order is deleted, the quantities associated with the order are returned to inventory.

### Validation and error handling

The API validates incoming request data and returns appropriate HTTP status codes and error responses.

---

# Database

The application uses PostgreSQL.

When running through Docker Compose, PostgreSQL runs as a dedicated container with a named Docker volume for persistent database storage.

The services communicate through the Docker Compose network.

```text
React / Nginx
      │
      ▼
FastAPI
      │
      ▼
PostgreSQL
```

---

# Docker Architecture

The application is fully containerized.

Docker Compose runs three services:

```text
┌──────────────────────────────┐
│        React + Nginx         │
│         Port: 5173           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          FastAPI             │
│         Port: 8000           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         PostgreSQL           │
│         Port: 5432           │
└──────────────────────────────┘
```

The frontend is built using a multi-stage Docker build and served using Nginx.

The backend is packaged into its own Docker container.

PostgreSQL uses a named Docker volume for persistence.

---

# Environment Variables

Environment-specific configuration is kept outside the source code.

Example environment files are provided for reference.

Real environment files containing passwords or other sensitive values should not be committed to version control.

---

# API Documentation

When the backend is running, FastAPI automatically provides interactive API documentation.

Open:

```text
http://localhost:8000/docs
```

This interface can be used to:

- Explore available endpoints
- View request and response schemas
- Submit API requests
- Test API responses
- Verify validation and error handling

---

# Testing

The application has been manually tested across the main functional flows.

Important flows include:

### Products

- Creating products
- Viewing products
- Updating products
- Deleting products
- Inventory quantity handling

### Customers

- Creating customers
- Viewing customers
- Retrieving individual customers
- Deleting customers
- Email validation

### Orders

- Creating orders
- Viewing orders
- Viewing individual orders
- Inventory reduction
- Insufficient-stock validation
- Automatic total calculation
- Deleting orders
- Inventory restoration

### Dashboard

- Product count
- Customer count
- Order count
- Low-stock products

### Docker

The complete application has been tested using Docker Compose with:

- PostgreSQL
- FastAPI
- React
- Nginx

---

# Deployment

The project is intended to be deployed online using free hosting platforms.

## Backend

Planned/actual backend deployment:

```text
Platform: <RENDER / RAILWAY / FLY.IO>
URL: <LIVE_BACKEND_URL>
```

## Frontend

Planned/actual frontend deployment:

```text
Platform: <VERCEL / NETLIFY>
URL: <LIVE_FRONTEND_URL>
```

After deployment, the frontend must be configured to communicate with the deployed backend API.

---

# Project Links

## GitHub Repository

```text
<GITHUB_REPOSITORY_URL>
```

## Docker Hub

Backend Docker image:

```text
<DOCKER_HUB_BACKEND_IMAGE_URL>
```

## Live Application

Frontend:

```text
<LIVE_FRONTEND_URL>
```

Backend API:

```text
<LIVE_BACKEND_URL>
```

API Documentation:

```text
<LIVE_BACKEND_URL>/docs
```

---

# Screenshots / Demo

Screenshots demonstrating the application can be added here.

Suggested screenshots:

1. Dashboard
2. Product management
3. Customer management
4. Order creation
5. Order list/details
6. FastAPI `/docs`
7. Docker containers running

---

# Author

**Abhishek Srivastava**

This project was developed as part of a Software Engineer technical assessment.