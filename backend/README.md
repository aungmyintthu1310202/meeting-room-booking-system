# Meeting Room Booking System (Backend)

## Objective

This is the backend API for the Meeting Room Booking System. It provides:
- REST endpoints for user authentication and authorization
- CRUD operations for bookings and users
- Data persistence using MongoDB
- JWT-based authentication and protected routes

The backend is designed to be used together with the frontend in `meeting-room-booking-system-frontend`.

## Project Setup Guideline

1. Open a terminal in `meeting-room-booking-system-backend`.
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

- Create a `.env` file in the project root (or use your environment manager).
- Example variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/meeting_booking
JWT_SECRET=your_jwt_secret_here
```

4. Start the server (development):

```bash
npm run dev
```

## Folder Structure

`meeting-room-booking-system-backend/`

- `app.js` — express app setup and middleware
- `server.js` — server entry point
- `package.json` — project metadata and scripts
- `routes/` — route definitions
  - `auth.routes.js`
  - `booking.routes.js`
  - `user.routes.js`
- `src/`
  - `config/`
    - `db.js` — database connection helper
  - `controllers/` — request handlers
    - `auth.controller.js`
    - `booking.controller.js`
    - `user.controller.js`
  - `middlewares/`
    - `authMiddleware.js` — protect routes
  - `models/` — Mongoose models
    - `booking.model.js`
    - `user.model.js`

## Running Guide

1. Ensure MongoDB is running and accessible via the `MONGO_URI` you configured.
2. Start the backend server:

```bash
npm run dev
```

3. Default server URL:

```
http://localhost:5000
```

4. API Endpoints (examples):

- `POST /api/auth/login` — login and receive JWT
- `GET /api/bookings` — list bookings (protected)
- `POST /api/bookings` — create booking (protected)
- `GET /api/users` — list users (admin)

Check the `routes/` and `src/controllers/` folders for complete endpoint details.

## Testing

- If tests exist, run:

```bash
npm test
```

## Notes

- Use `nodemon` for automatic restarts during development (`npm run dev`).
- Make sure the frontend's API base URL matches the backend server URL.
- Securely store `JWT_SECRET` and any production database credentials.
