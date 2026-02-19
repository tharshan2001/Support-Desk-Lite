# Support Desk Lite

**Support Desk Lite** is a **full-stack support ticket management system** built for Yarl Ventures’ MERN Stack Intern assessment. It allows users to create and manage support tickets with role-based access and secure workflows.  

- **Customer**: Can create tickets, view own tickets, add public comments. Cannot see internal notes.  
- **Agent**: Can view all tickets, assign tickets, change ticket status, add public and internal comments.  
- **Admin**: All agent permissions plus user and role management.

This project demonstrates:
- Role-based access control  
- Secure authentication with JWT  
- Input validation with Joi  
- Ticket lifecycle with strict status transitions  
- Comment system with public/internal notes  
- Pagination, filtering, and search on tickets  
- Integration and frontend testing

---

## Table of Contents

1. [Tech Stack](#tech-stack)  
2. [Setup Instructions](#setup-instructions)  
3. [Environment Variables](#environment-variables)  
4. [Seed Data](#seed-data)  
5. [API Routes](#api-routes)  
6. [Testing](#testing)  
7. [Postman Collection](#postman-collection)  
8. [Screenshots / Demo](#screenshots-demo)  
9. [Contributing / Notes](#contributing-notes)

---

## Tech Stack

**Backend**:  
- Node.js, Express.js  
- MongoDB, Mongoose  
- JWT for authentication  
- Joi for input validation  
- Jest + Supertest for integration tests

**Frontend**:  
- React (TypeScript optional)  
- React Testing Library  
- Axios for API calls  

**Other Tools**:  
- dotenv for environment variables  
- nodemon for development  
- Postman for API testing

---

## Setup Instructions

1. Clone the repository:  
```bash
git clone <your-repo-url>
cd support-desk-lite


Install dependencies:

npm install


Create a .env file based on .env.example with your local credentials.

Seed the database with initial users and tickets:

npm run seed


Start the backend server:

npm run dev


Start the frontend server (from /client folder if separate):

npm start


Access the app at http://localhost:3000 (frontend) and backend API at http://localhost:5000/api

Environment Variables

Your .env file should include:

PORT=5000
MONGO_URI=<your-local-mongodb-uri>
JWT_SECRET=<your-secret-key>


See .env.example for placeholders.

Seed Data

1 Admin user

1 Agent user

1 Customer user

3 sample tickets with mixed statuses and comments (public and internal)

Use the seeded emails and password (as per .env) to log in.

API Routes

Authentication:

POST /api/auth/register – Register a new user

POST /api/auth/login – Login and receive JWT

Tickets:

POST /api/tickets – Create ticket (Customer/Agent/Admin)

GET /api/tickets – List tickets with filters and pagination

GET /api/tickets/:id – Get ticket detail

PATCH /api/tickets/:id/assign – Assign ticket (Agent/Admin)

PATCH /api/tickets/:id/status – Change ticket status (Agent/Admin)

Comments:

POST /api/comments – Add public comment (all roles)

POST /api/comments/internal – Add internal note (Agent/Admin only)

GET /api/tickets/:id/comments – Get ticket comments (internal notes hidden from Customers)

All protected routes require Authorization: Bearer <token>

Testing

Backend Tests (Jest + Supertest)

Run all tests:

npm test


Minimum required test coverage:

Login returns JWT

Customer cannot access other customers’ tickets

Invalid status transitions return 400

Agent can change ticket status correctly

Internal notes never appear for customers

Pagination works and returns correct response shape

Frontend Tests (React Testing Library)

Login form validation

Role-based UI elements (internal notes hidden for Customer)

Postman Collection

Collection JSON: CandidateID_support_desk_lite.postman_collection.json

Environment JSON: CandidateID_support_desk_lite.postman_environment.json

Use these to test authentication, ticket creation, status changes, and comments end-to-end

Screenshots / Demo

Include:

Login page

Ticket list page with filters

Ticket detail with comments

Create ticket modal/page

Optional: add screen recording (3–6 min) of:

Login → create ticket → change status → add comment

Contributing / Notes

Follow role-based access rules carefully

Never hardcode JWT secrets or DB URIs

Commit incrementally with meaningful messages for auto-review

Document any deviations from the spec in this README


---

If you want, I can **turn this into a direct downloadable `.md` file link**, so you can just click and save it instead of copying manually.  

Do you want me to do that next?
