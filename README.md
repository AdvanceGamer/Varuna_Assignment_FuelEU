# FuelEU Maritime — Compliance Platform

A full-stack web application that models the **FuelEU Maritime Compliance** process, built with clean architecture and modern web tools.

## Tech Stack

**Frontend:** React + TypeScript + TailwindCSS v4 + React Query + Recharts  
**Backend:** Fastify + TypeScript (strict) + Prisma + PostgreSQL  
**Architecture:** Hexagonal (Ports & Adapters / Clean Architecture)

---

## Features Overview

### Routes
- Lists all maritime routes with vessel, fuel, and emission data.
- “Set Baseline” button updates the baseline route in the database.

### Compare
- Compares each route’s intensity against the baseline.
- Calculates % difference and compliance against the 2025 target (89.3368 gCO₂e/MJ).

### Banking (Article 20)
- Computes a ship’s **Compliance Balance (CB)**:  
  "CB = (Target − Actual) × Energy"
- Banks surplus CB.
- Applies stored surplus to deficit ships.

### Pooling (Article 21)
- Creates pools of ships.
- Redistributes surplus between members while ensuring no ship exits worse off.
- Displays before/after CBs and pool validity.

## Core Formula

- **Target (2025):** 89.3368 gCO₂e/MJ  
- **Energy (MJ):** "fuelConsumption × 41,000"  
- **Compliance Balance:** "(Target − Actual) × Energy"  
  - Positive CB → Surplus  
  - Negative CB → Deficit
 
## Project Structure
backend/src/
core/ → domain entities & use-cases
adapters/ → inbound (http) + outbound (postgres)
infrastructure/ → db, server setup
shared/ → constants & helpers
prisma/ → schema & seed data

frontend/src/
core/ → domain logic
adapters/
ui/ → React components & pages
infrastructure/ → API clients
shared/ → constants
 
##  Setup Instructions

### Backend
1. cd backend
2. npm install
3. Create .env:
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fueleu?schema=public"
# Start PostgreSQL
4. docker run --name fueleu-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16 
# initialize plazma
5. npx prisma generate
    npm run prisma:migrate
    npm run prisma:seed
    npm run dev

6. Backend runs at  http://localhost:3001

### Frontend

1. cd frontend
2. npm install
3. Create .env:
            VITE_API_BASE_URL=http://localhost:3001
# run development server
4. npm run dev
5. Frontend runs at  http://localhost:5173


##  API Endpoints
Method	Endpoint	           Description
GET	    /routes	List            all routes
POST	/routes/:id/baseline	Set baseline route
GET	    /routes/comparison	    Get comparison vs baseline
GET	    /compliance/cb	        Compute Compliance Balance
POST	/banking/bank	        Bank positive CB
POST	/banking/apply	        Apply banked surplus
POST	/pools	                Create and validate a pool


## Testing (Manual)

# Set baseline
Invoke-RestMethod -Uri "http://localhost:3001/routes/2/baseline" -Method POST -ContentType "application/json"

# List routes
Invoke-RestMethod -Uri "http://localhost:3001/routes" -Method GET

# Compute CB (Surplus)
Invoke-RestMethod -Uri "http://localhost:3001/compliance/cb?shipId=S002&year=2025&intensity=88&fuelTons=4800" -Method GET

# Compute CB (Deficit)
Invoke-RestMethod -Uri "http://localhost:3001/compliance/cb?shipId=S001&year=2025&intensity=90.5&fuelTons=4950" -Method GET

# Bank Full
Invoke-RestMethod -Uri "http://localhost:3001/banking/bank" -Method POST -ContentType "application/json" -Body '{"shipId":"S002","year":2025}'

# Apply Banked
Invoke-RestMethod -Uri "http://localhost:3001/banking/apply" -Method POST -ContentType "application/json" -Body '{"shipId":"S001","year":2025,"amount":50000}'

# Create Pool
Invoke-RestMethod -Uri "http://localhost:3001/pools" -Method POST -ContentType "application/json" -Body '{"year":2025,"members":[{"shipId":"S001"},{"shipId":"S002"}]}'


## Screenshots 

# Routes 
![alt text](image.png)
# Compare
![alt text](image-1.png)
# Banking 
![alt text](image-2.png)
# Pooling 
![alt text](image-3.png)
