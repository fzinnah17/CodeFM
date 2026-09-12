# CodeFM

> A full-stack community platform for early-career developers to discuss technical topics, share learning resources, and discover opportunities.

**React · Express · PostgreSQL · GitHub OAuth · REST API**

Developed by **Myesha Mahazabeen** and **Farnaz Zinnah**.

---

## System Snapshot

```text
┌──────────────────────────── CLIENT ────────────────────────────┐
│                                                               │
│   React + Vite                                                │
│                                                               │
│   Home ──► GitHub Login                                       │
│              │                                                │
│              ▼                                                │
│   Protected Application Routes                                │
│      ├── Discussion Board                                     │
│      ├── Resources                                            │
│      ├── Events                                               │
│      ├── Create Post                                          │
│      └── Post Detail                                          │
│                                                               │
└──────────────────────────────┬────────────────────────────────┘
                               │
                         REST / OAuth
                               │
                               ▼
┌──────────────────────────── SERVER ────────────────────────────┐
│                                                               │
│   Express                                                     │
│      ├── GitHub OAuth / Passport                              │
│      ├── Session Authentication                               │
│      ├── Posts API                                            │
│      ├── Comments API                                         │
│      ├── Resources API                                        │
│      ├── Resource Types API                                   │
│      └── Users API                                            │
│                                                               │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
┌────────────────────────── POSTGRESQL ──────────────────────────┐
│                                                               │
│   Users · Posts · Comments · Resources · Types                │
│   User ↔ Resource relationship                                │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## What CodeFM Does

CodeFM was built as a community-oriented platform for students and early-career technologists.

The application combines authentication, relational data, REST APIs, and a multi-page React interface in a single full-stack system.

### Discussion Board

Authenticated users can browse posts, create new discussions, edit existing posts, open individual post views, and delete posts.

### Resource Library

Learning resources are retrieved from the backend and organized by category. The data model also supports relationships between users and shared resources.

### Authentication

GitHub OAuth is handled through Passport on the Express server.

Application routes such as the discussion board, resources, events, and creation flows are protected on the client.

### Events

The authenticated application includes an events area intended to surface technical and career-development opportunities alongside the community and learning features.

---

## Application Walkthrough

<p align="center">
  <img
    src="GIFs/CodeFM-final-GIF.gif"
    alt="CodeFM application walkthrough"
    width="800"
  />
</p>

---

## Architecture

```mermaid
flowchart LR
    U[User] --> R[React Client]

    R -->|GitHub Login| O[GitHub OAuth]
    R -->|HTTP Requests| E[Express API]

    O --> P[Passport]
    P --> E

    E --> A[Authentication]
    E --> POSTS[Posts]
    E --> COMMENTS[Comments]
    E --> RES[Resources]
    E --> USERS[Users]

    A --> DB[(PostgreSQL)]
    POSTS --> DB
    COMMENTS --> DB
    RES --> DB
    USERS --> DB
```

### Frontend

The client is built with React and Vite and uses React Router for navigation.

```text
client/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── services/
│   └── css/
├── package.json
└── vite.config.mjs
```

Application state is separated into authentication and API-context layers, while server communication is organized through service modules.

### Backend

The server uses Express with PostgreSQL-backed application data.

```text
server/
├── config/
│   ├── auth.js
│   ├── database.js
│   ├── dotenv.js
│   └── reset.js
├── controllers/
├── routes/
├── data/
├── server.js
└── package.json
```

Routes and controllers separate HTTP handling from database operations.

---

## Data Model

<p align="center">
  <img
    src="ERD/CodeFM%20Ultra-2023-10-29-162922.png"
    alt="CodeFM entity relationship diagram"
    width="800"
  />
</p>

The PostgreSQL schema includes:

| Entity | Purpose |
|---|---|
| `GITHUBUSER` | Authenticated GitHub users |
| `POST` | Discussion-board posts |
| `COMMENT` | Comments associated with posts |
| `TYPE` | Resource categories |
| `RESOURCE` | Learning resources |
| `USER_RESOURCE` | User-to-resource relationship |

The `USER_RESOURCE` table provides the relational layer needed for resources to be associated with multiple users.

---

## API Surface

The Express server organizes functionality into dedicated route groups:

```text
/auth
/api/users
/api/posts
/api/comments
/api/resources
/api/types
```

This separation keeps authentication, discussion content, resource management, and user data independently addressable.

---

## Security Maintenance

The project was revisited and hardened after its original development.

Current safeguards include:

- secrets and database credentials loaded from environment variables
- `.env` excluded from version control
- configurable session secret
- PostgreSQL-backed session storage
- GitHub OAuth tokens are not persisted in the application database
- authentication secrets and OAuth tokens are not written to application logs
- public user responses exclude authentication credentials
- current client and server dependency audits report no known vulnerabilities

An `.env.example` file documents the required configuration without exposing credentials.

---

## Local Development

### 1. Clone

```bash
git clone https://github.com/fzinnah17/CodeFM.git
cd CodeFM
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Provide your own PostgreSQL and GitHub OAuth configuration:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE

GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback

SESSION_SECRET=replace_with_a_long_random_value

CLIENT_URL=http://localhost:5173
NODE_ENV=development
PORT=3001
```

Do not commit `.env`.

### 3. Install the server

```bash
cd server
npm install
npm run reset
npm run dev
```

The API runs on:

```text
http://localhost:3001
```

### 4. Start the client

In another terminal:

```bash
cd client
npm install
npm run dev
```

The client runs on:

```text
http://localhost:5173
```

---

## Technology

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Routing | React Router |
| HTTP | Axios |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Authentication | GitHub OAuth, Passport |
| Sessions | express-session, connect-pg-simple |
| API style | REST |

---

## Project Context

CodeFM originated as a collaborative full-stack project and was later preserved as a standalone repository.

The current repository keeps the original development history and team attribution while updating authentication practices, dependency security, configuration handling, and project documentation.

---

## Contributors

**Myesha Mahazabeen**

**Farnaz Zinnah**

Original application design and development were completed collaboratively.

---

## Repository Status

```text
STATUS        maintained portfolio project
FRONTEND      React / Vite
BACKEND       Express
DATABASE      PostgreSQL
AUTH          GitHub OAuth
SECURITY      dependency audits clean
```
