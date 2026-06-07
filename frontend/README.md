# Meeting Room Booking System (Frontend)

## Objective

This frontend application is part of the Meeting Room Booking System. It provides:
- a smooth interface for users to view and book meeting rooms
- authentication and login support
- booking creation and management features
- an admin view for managing users
- seamless interaction with the backend API

## Project Setup Guideline

1. Open a terminal in `meeting-room-booking-system-frontend`.
2. Install dependencies:
   - `npm install`
3. Start the development server:
   - `npm start`
4. Open the browser at `http://localhost:3000`.

## Folder Structure

`meeting-room-booking-system-frontend/`

- `public/`
  - `index.html` — root HTML file
  - `manifest.json` — PWA manifest
  - `robots.txt` — crawler instructions
- `src/`
  - `App.js` — main application component
  - `index.js` — React entry point
  - `routes.js` — route definitions
  - `theme.js` — app theming configuration
  - `reportWebVitals.js` — performance helper
  - `setupTests.js` — test setup file
  - `common/utils/` — shared utility functions
    - `getClientName.js`
  - `components/` — reusable UI components
    - `BookingForm.js`
    - `BookingsList.js`
    - `PublicRoute.js`
  - `pages/` — application pages
    - `Dashboard.js`
    - `NotFound.js`
    - `admin/UsersAdmin.js`
    - `auth/Login.js`

## Running Guide

### Development

- Run `npm start`
- Visit `http://localhost:3000`
- The app reloads automatically when files change.

## Notes

- Make sure the backend server is running before using the frontend.
- If the backend API URL changes, update the frontend configuration accordingly.
- This frontend is intended to work with the backend in `meeting-room-booking-system-backend`.

