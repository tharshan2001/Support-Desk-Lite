# Support Desk Lite

**Support Desk Lite** is a full-stack support ticket management system built as part of the **Yarl Ventures – MERN Stack Intern Technical Assessment**.  
It demonstrates secure authentication, strict role-based access control, ticket lifecycle management, and comprehensive testing.

## Roles
- **Customer**: Create tickets, view own tickets only, add public comments. Cannot see or create internal notes.
- **Agent**: View all tickets, assign tickets, change ticket status, add public comments and internal notes.
- **Admin**: All Agent permissions plus manage users and roles.

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Joi (request validation)
- Jest + Supertest (integration tests)

### Frontend
- React
- React Testing Library
- Axios

### Tools
- dotenv
- nodemon
- Postman

---

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/tharshan2001/Support-Desk-Lite.git
cd Support-Desk-Lite

## 2. Install Dependencies

```bash
npm install
```

If frontend is in a separate folder:

```bash
cd client
npm install
```

## 3. Environment Variables

Create a `.env` file in the root directory using `.env.example` as reference.

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Seed Data

Run the seed script:

```bash
npm run seed
```

This will create:

- 1 Admin user
- 1 Agent user
- 1 Customer user
- At least 3 tickets with mixed statuses and comments

Seeded credentials are documented in the seed file and `.env.example`.

## Running the Application

### Backend

```bash
npm run dev
```

Backend API:

http://localhost:5000/api

### Frontend

```bash
cd client
npm start
```

Frontend App:

http://localhost:3000

## API Routes

### Authentication

- POST `/api/auth/register` – Register user
- POST `/api/auth/login` – Login and receive JWT

### Tickets

- POST `/api/tickets` – Create ticket
- GET `/api/tickets` – List tickets (filters + pagination)
- GET `/api/tickets/:id` – Get ticket by ID
- PATCH `/api/tickets/:id/assign` – Assign ticket (Agent/Admin)
- PATCH `/api/tickets/:id/status` – Change ticket status (Agent/Admin)

### Comments

- POST `/api/comments` – Add public comment
- POST `/api/comments/internal` – Add internal note (Agent/Admin only)
- GET `/api/tickets/:id/comments` – Get ticket comments (Internal notes are automatically hidden for Customers)

All protected routes require:

```
Authorization: Bearer <access_token>
```

## Testing

### Backend Tests

```bash
npm test
```

Includes:

- Login returns JWT
- Customer cannot access another customer’s ticket
- Invalid ticket status transitions return 400
- Valid status transitions succeed
- Internal notes never appear for Customer
- Pagination response shape and limits

### Frontend Tests

```bash
npm test
```

Includes:

- Login form validation errors
- Internal note UI hidden for Customer role

### Postman Collection

Postman Workspace: [Postman Workspace](https://www.postman.com/tharshan-5399631/workspace/support-desk-lite)

Includes:

- Auth flows
- Ticket CRUD
- Status transitions
- Public & internal comments
- Environment variables with auto token handling

## Notes

- All write endpoints are validated using Joi.
- Ticket status transitions strictly follow the allowed rules.
- Customers can never access other customers’ tickets or internal notes.
- No secrets are hardcoded; all sensitive values are stored in environment variables.
- Git history reflects incremental development with meaningful commits.