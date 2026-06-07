# 🎾 PadelZGZ – AA2 Diseño de Interfaces

Aplicación web de reserva de pistas de pádel en Zaragoza. Desarrollada para la Actividad de Aprendizaje 2 de la asignatura **Diseño de Interfaces** (2º DAM – SEAS / Fundación San Valero).

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + React Router v6 |
| Estado global | Context API + useReducer |
| Backend | Node.js + Express |
| Base de datos | SQLite (better-sqlite3) |
| Autenticación | JWT + bcryptjs |
| Testing unitario | Vitest + Testing Library (frontend) / Jest + Supertest (backend) |
| Testing E2E | Playwright |
| Despliegue | Docker + Docker Compose |
| API externa | Open-Meteo (tiempo en Zaragoza) |

## Arranque en local (sin Docker)

```bash
# Backend
cd backend
npm install
npm start          # → http://localhost:3001

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

## Arranque con Docker

```bash
docker-compose up --build
# Frontend → http://localhost:5173
# Backend  → http://localhost:3001
```

## Tests

```bash
# Backend (Jest + Supertest)
cd backend
npm test

# Frontend (Vitest)
cd frontend
npm test

# E2E (Playwright) — requiere backend y frontend corriendo
cd frontend
npm run test:e2e
```

## Cuentas de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@padelzgz.com | admin123 |
| Usuario | carlos@email.com | user123 |
| Usuario | laura@email.com | user123 |

## Estructura del proyecto

```
padelzgz-aa2/
├── backend/
│   ├── src/
│   │   ├── controllers/   authController, courtsController, reservationsController
│   │   ├── db/            database.js (init + seed SQLite)
│   │   ├── middleware/    auth.js (JWT + rol admin)
│   │   ├── routes/        auth, courts, reservations
│   │   └── index.js       servidor Express
│   └── tests/
│       └── auth.test.js
├── frontend/
│   ├── src/
│   │   ├── context/       AuthContext.jsx (Context + reducer)
│   │   ├── services/      apiClient, authService, courtsService, reservationsService, weatherService
│   │   ├── hooks/         useCourts, useReservations
│   │   ├── components/
│   │   │   ├── layout/    Navbar, ProtectedRoute
│   │   │   └── ui/        CourtCard, SearchBar, WeatherBanner, Feedback
│   │   ├── pages/         Home, Login, Register, CourtDetail, MisReservas, AdminDashboard
│   │   └── utils/         formatters.js
│   ├── tests/             app.test.jsx (Vitest)
│   └── e2e/               padelzgz.spec.js (Playwright)
└── docker-compose.yml
```

## Endpoints API

### Auth
| Método | Ruta | Acceso |
|--------|------|--------|
| POST | /api/auth/register | Público |
| POST | /api/auth/login | Público |
| GET | /api/auth/me | Autenticado |

### Courts
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | /api/courts | Público |
| GET | /api/courts/:id | Público |
| POST | /api/courts | Admin |
| PUT | /api/courts/:id | Admin |
| DELETE | /api/courts/:id | Admin |

### Reservations
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | /api/reservations/my | Autenticado |
| GET | /api/reservations/all | Admin |
| GET | /api/reservations/stats | Admin |
| GET | /api/reservations/slots | Autenticado |
| POST | /api/reservations | Autenticado |
| PATCH | /api/reservations/:id/cancel | Autenticado |
