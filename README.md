# ⚡ TaskFlow: Enterprise Agile & Workspace Management Hub

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.2-purple?logo=redux)](https://redux-toolkit.js.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.18-indigo?logo=prisma)](https://prisma.io)
[![Express](https://img.shields.io/badge/Express-4.19-lightgray?logo=express)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-blue?logo=postgresql)](https://postgresql.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**TaskFlow** is an enterprise-grade, all-in-one project management, sprint orchestration, and workflow tracking platform engineered for modern software development, design, and product organizations. It empowers teams to visually organize deliverables, track milestone deadlines, analyze task velocity, and assign member workloads across interactive Kanban boards, Gantt charts, and analytical dashboards.

At its core, TaskFlow operates a **Reactive State & Data Synchronization Engine** combining **Next.js 14 App Router**, **RTK Query**, **TypeScript Express API Gateway**, and **Prisma ORM**, guaranteeing zero schedule double-booking, atomic database updates, and strict relational integrity.

---

## 📖 Table of Contents

- [⚡ TaskFlow: Enterprise Agile \& Workspace Management Hub](#-taskflow-enterprise-agile--workspace-management-hub)
  - [📖 Table of Contents](#-table-of-contents)
  - [🌐 Live System Endpoints](#-live-system-endpoints)
  - [🗺️ System Architecture \& Topology](#️-system-architecture--topology)
    - [1. Data Flow & Subsystem Architecture](#1-data-flow--subsystem-architecture)
    - [2. Authentication \& Session Lifecycle](#2-authentication--session-lifecycle)
    - [3. Task Lifecycle \& State Transitions](#3-task-lifecycle--state-transitions)
  - [🌟 Core Modules \& Platform Capabilities](#-core-modules--platform-capabilities)
    - [🏠 1. Modern Landing Homepage \& Auth Suite](#-1-modern-landing-homepage--auth-suite)
    - [📊 2. Executive Dashboard \& Real-Time Analytics](#-2-executive-dashboard--real-time-analytics)
    - [🎯 3. Interactive Agile Kanban \& Sprint Boards](#-3-interactive-agile-kanban--sprint-boards)
    - [📅 4. Multi-Resolution Gantt Timeline Scheduler](#-4-multi-resolution-gantt-timeline-scheduler)
    - [👥 5. Teams \& Workload Allocation Console](#-5-teams--workload-allocation-console)
    - [🔎 6. Unified Global Search \& Priority Views](#-6-unified-global-search--priority-views)
    - [🛡️ 7. Hardened Express API \& Security Architecture](#-7-hardened-express-api--security-architecture)
  - [🗄️ Database Relational ERD Schema](#️-database-relational-erd-schema)
  - [🔌 REST API Specification Reference](#-rest-api-specification-reference)
    - [Projects Endpoint (`/projects`)](#projects-endpoint-projects)
    - [Tasks Endpoint (`/tasks`)](#tasks-endpoint-tasks)
    - [Users Endpoint (`/users`)](#users-endpoint-users)
    - [Teams Endpoint (`/teams`)](#teams-endpoint-teams)
    - [Search Endpoint (`/search`)](#search-endpoint-search)
  - [🛠️ Technology Stack Matrix](#️-technology-stack-matrix)
  - [⚙️ Detailed Setup Guide](#️-detailed-setup-guide)
    - [Prerequisites](#prerequisites)
    - [Step 1: Clone Repository](#step-1-clone-repository)
    - [Step 2: Configure Server \& Database](#step-2-configure-server--database)
    - [Step 3: Configure Client Application](#step-3-configure-client-application)
  - [☁️ Cloud Deployment Playbook](#️-cloud-deployment-playbook)
    - [Frontend Deployment (AWS Amplify Hosting)](#frontend-deployment-aws-amplify-hosting)
    - [Backend API Deployment (AWS EC2 + PM2)](#backend-api-deployment-aws-ec2--pm2)
    - [Database Clustering (AWS RDS PostgreSQL)](#database-clustering-aws-rds-postgresql)
  - [🔍 System Verification \& Build Checks](#-system-verification--build-checks)
  - [📂 Complete Directory Structure Map](#-complete-directory-structure-map)
  - [📄 License](#-license)

---

## 🌐 Live System Endpoints

* **Web Application (Client Dev):** [http://localhost:3000](http://localhost:3000) *(or http://localhost:3001)*
* **Backend API Gateway (Express REST):** [http://localhost:8000](http://localhost:8000)
* **Database Connection Cluster:** `postgresql://postgres:password@localhost:5432/taskflow_db`

---

## 🗺️ System Architecture & Topology

TaskFlow is engineered with a decoupled, high-throughput monorepo architecture connecting a client-side Next.js App Router workspace with a TypeScript Express REST API gateway and PostgreSQL storage.

### 1. Data Flow & Subsystem Architecture

```mermaid
graph TD
    A[Next.js Client / Web Browser] <-->|RTK Query / Redux State| B[Express REST API Gateway]
    A <-->|Auth Provider Claims & Demo Sub| C[Local Storage Session Provider]
    B <-->|Input Validation & Sanity Checks| D[Express Controllers Layer]
    D <-->|Prisma ORM Client / Type Safety| E[(PostgreSQL Relational DB)]
    D <-->|Global Error Middleware| F[Error Trace & Status Masker]
```

### 2. Authentication & Session Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Visitor
    participant Landing as Landing Page
    participant Modal as Auth Modal Window
    participant Client as AuthProvider / RTK Query
    participant Server as Express User Controller
    participant DB as PostgreSQL Database

    User->>Landing: Access http://localhost:3000
    Landing-->>User: Render Landing Page (Hero, Demo, Features)
    User->>Landing: Click "Get Started / Login"
    Landing->>Modal: Open Auth Modal (Sign In / Sign Up)
    
    alt Standard Sign In / Sign Up
        User->>Modal: Enter Username & Password
        Modal->>Server: POST /users/login (or POST /users)
        Server->>DB: Case-Insensitive Lookup / Password Compare
        DB-->>Server: User Details & cognitoId
        Server-->>Modal: 200 OK + User Object
    else ⚡ 1-Click Quick Demo Sign-In
        User->>Modal: Click "Quick Demo Sign-In"
        Modal->>Client: Auto-assign Demo User Sub ("AliceJones")
    end

    Client->>Client: Store taskflow_user_sub in localStorage
    Client->>Server: GET /users/:sub (Reactive Auth Check)
    Server-->>Client: Return User Profile & Team ID
    Client-->>User: Open Application Workspace Dashboard
```

### 3. Task Lifecycle & State Transitions

```mermaid
stateDiagram-v2
    [*] --> ToDo: Create New Task (Title, Points, Priority)
    ToDo --> WorkInProgress: Drag to In Progress / Update Status
    WorkInProgress --> UnderReview: Assignee requests Code / Deliverable Review
    UnderReview --> WorkInProgress: Reopen / Feedback Required
    UnderReview --> Completed: Review Approved & Target Due Date Met
    Completed --> [*]
```

---

## 🌟 Core Modules & Platform Capabilities

### 🏠 1. Modern Landing Homepage & Auth Suite
* **Dark-Mode Landing Showcase**: High-converting landing page featuring glowing gradients, version badge (`v2.0`), typography, CTA buttons (*"Get Started / Login"*, *"Explore Demo"*), and live productivity metrics.
* **Interactive Product Preview Widget**: Prospective users can switch between live interactive mock tabs (**Board View**, **Timeline View**, **Analytics View**) directly on the landing page.
* **Sleek Auth Modal Window**: Integrated Sign In and Create Account dialog featuring avatar picker (`p1.jpeg`–`p8.jpeg`), case-insensitive username matching, and automatic registration fallback.
* **⚡ 1-Click Quick Demo Sign-In**: Allows instant single-click login as a pre-seeded demo user (`AliceJones`), eliminating registration friction during evaluation.

### 📊 2. Executive Dashboard & Real-Time Analytics
* **Statistical Metrics Cards**: Summary widgets tracking assigned tasks, active projects, high/urgent priority alerts, and team membership.
* **Interactive Charting Engine**: Recharts-powered **Task Priority Analytics** bar charts and **Project Status Distribution** pie charts with dynamic light/dark theme colors.
* **Corrected Project Status Logic**: Projects with future end dates are accurately classified as **Active**, eliminating false completion counts.
* **Assigned Tasks DataGrid**: Tabular list built with `@mui/x-data-grid` featuring searching, sorting, pagination, and status badges.

### 🎯 3. Interactive Agile Kanban & Sprint Boards
* **Dynamic Status Columns**: Visual task management across workflow stages (*To Do, Work In Progress, Under Review, Completed*).
* **Urgency & Priority Badges**: Color-coded indicators for task priorities (*Urgent, High, Medium, Low, Backlog*).
* **1-Click Modal Task Creator**: Modal dialog specifying task title, description, priority, tags, points, author, and assignee.

### 📅 4. Multi-Resolution Gantt Timeline Scheduler
* **Global & Project-Level Timelines**: Dedicated roadmap views for multi-project scheduling (`/timeline`) and project-specific task schedules (`/projects/[id]`).
* **Segmented View Mode Control**: Interactive pill controls for **Day**, **Week**, and **Month** timeline zoom levels.
* **Search Filter & Gantt CSS Overrides**: Real-time project search input and custom CSS overrides for grid lines, date headers, task bars, progress fills, and dark mode contrast.

### 👥 5. Teams & Workload Allocation Console
* **Team Board Management**: View and create specialized engineering teams (*DevOps, Product, Frontend, Backend*), assign Product Owners, and designate Project Managers.
* **Active Team Badges**: Dynamic sidebar context reflecting the user's current team affiliation or personal workspace scope.

### 🔎 6. Unified Global Search & Priority Views
* **Global Search (`/search`)**: Search across task titles, descriptions, project names, and usernames simultaneously.
* **Dedicated Priority Views (`/priority/*`)**: Filtered task boards for **Urgent**, **High**, **Medium**, **Low**, and **Backlog** priorities.

### 🛡️ 7. Hardened Express API & Security Architecture
* **Strict Input Sanitization**: Parameter validation (`NaN` protection) preventing invalid route requests (`/users/[object Object]`).
* **Raw Stack Trace Masking**: Centralized Express error-handling middleware preventing database stack trace leaks.
* **Cascading Delete Safety**: Relational delete operations cleaning up associated tasks, assignments, comments, and attachments cleanly.

---

## 🗄️ Database Relational ERD Schema

```mermaid
erDiagram
    USER ||--o{ TASK : "authors / assigned"
    USER ||--o{ TASK_ASSIGNMENT : "assigned_to"
    USER ||--o{ COMMENT : "posts"
    USER ||--o{ ATTACHMENT : "uploads"
    USER }|--|| TEAM : "belongs_to"
    
    TEAM ||--o{ PROJECT_TEAM : "associated_with"
    PROJECT ||--o{ PROJECT_TEAM : "includes"
    PROJECT ||--o{ TASK : "contains"
    
    TASK ||--o{ TASK_ASSIGNMENT : "has_assignments"
    TASK ||--o{ COMMENT : "has_comments"
    TASK ||--o{ ATTACHMENT : "has_attachments"

    USER {
        int userId PK
        string cognitoId UK
        string username UK
        string email
        string password
        string profilePictureUrl
        int teamId FK
    }

    TEAM {
        int id PK
        string teamName
        int productOwnerUserId
        int projectManagerUserId
    }

    PROJECT {
        int id PK
        string name
        string description
        datetime startDate
        datetime endDate
    }

    TASK {
        int id PK
        string title
        string description
        string status
        string priority
        string tags
        datetime startDate
        datetime dueDate
        int points
        int projectId FK
        int authorUserId FK
        int assignedUserId FK
    }
```

---

## 🔌 REST API Specification Reference

### Projects Endpoint (`/projects`)
* `GET /projects` - Retrieve all projects.
* `POST /projects` - Create a new project.
  * **Payload**: `{ "name": "Alpha", "description": "Core release", "startDate": "2026-08-01", "endDate": "2026-12-31" }`
* `DELETE /projects/:id` - Delete a project and cascade-delete its associated tasks, comments, and assignments.

### Tasks Endpoint (`/tasks`)
* `GET /tasks?projectId=1` - Retrieve all tasks for a specific project.
* `POST /tasks` - Create a new task.
  * **Payload**: `{ "title": "API Refactoring", "description": "Add Redis caching", "status": "To Do", "priority": "High", "tags": "backend", "startDate": "2026-08-01", "dueDate": "2026-08-15", "points": 5, "projectId": 1, "authorUserId": 1, "assignedUserId": 2 }`
* `PATCH /tasks/:taskId/status` - Update task status (*To Do, Work In Progress, Under Review, Completed*).
  * **Payload**: `{ "status": "Completed" }`
* `GET /tasks/user/:userId` - Retrieve tasks authored by or assigned to a specific user.
* `DELETE /tasks/:taskId` - Delete a task and its comments/attachments.

### Users Endpoint (`/users`)
* `GET /users` - Retrieve all registered users.
* `POST /users` - Register a new user account.
  * **Payload**: `{ "username": "AlexMorgan", "email": "alex@example.com", "password": "SecretPassword123", "profilePictureUrl": "p1.jpeg" }`
* `POST /users/login` - Authenticate user credentials.
  * **Payload**: `{ "username": "AlexMorgan", "password": "SecretPassword123" }`
* `GET /users/:cognitoId` - Retrieve user profile by cognitoId, username, or userId.
* `PATCH /users/:userId/team` - Assign or change user team affiliation.

### Teams Endpoint (`/teams`)
* `GET /teams` - Retrieve all teams with resolved Product Owner & Project Manager usernames.
* `POST /teams` - Create a new team.
  * **Payload**: `{ "teamName": "DevOps", "productOwnerUserId": 1, "projectManagerUserId": 2 }`

### Search Endpoint (`/search`)
* `GET /search?query=auth` - Search query string across task titles, descriptions, project names, and usernames.

---

## 🛠️ Technology Stack Matrix

| Layer | Technology | Version | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Next.js | `v14.2.5` | React App Router framework with Server-Side Rendering (SSR) & Static Generation |
| **UI Library** | React | `v18.3.1` | Component-driven declarative web user interface |
| **Styling** | Tailwind CSS | `v3.4.1` | Utility-first CSS framework for responsive dark/light glassmorphic styling |
| **State Management**| Redux Toolkit | `v2.2.7` | Global application state management |
| **API Caching** | RTK Query | `v2.2.7` | Reactive endpoint data fetching, caching, and auto-invalidation |
| **UI Icons** | Lucide React | `v0.427.0` | Modern vector icon set |
| **Analytics Charts** | Recharts | `v2.12.7` | Data visualization charts (BarChart, PieChart, Tooltips) |
| **Data Grid** | MUI DataGrid | `v7.12.0` | Enterprise DataGrid tabular layout with sorting & filtering |
| **Timeline Engine** | `gantt-task-react` | `v0.3.9` | Gantt chart roadmap renderer with custom dark-mode CSS overrides |
| **Backend Framework**| Express | `v4.19.2` | High-throughput REST API gateway written in TypeScript |
| **Runtime Engine** | Node.js | `v18.0+` | Server-side JavaScript execution environment |
| **Database ORM** | Prisma ORM | `v5.18.0` | Type-safe PostgreSQL relational modeling & schema migrations |
| **Database** | PostgreSQL | `v14.0+` | Relational storage for users, teams, projects, tasks, comments, and files |
| **Security & Utilities**| Helmet, Cors, Morgan, Bcryptjs | Latest | HTTP security headers, CORS isolation, logging, and password hashing |

---

## ⚙️ Detailed Setup Guide

### Prerequisites
Make sure your development machine has the following tools installed:
* **Node.js:** `v18.0.0` or higher
* **npm:** `v9.0.0` or higher
* **PostgreSQL:** Local Postgres database engine or cloud instance

---

### Step 1: Clone Repository

```bash
git clone https://github.com/sivansrawat/TaskFlow.git
cd TaskFlow
```

---

### Step 2: Configure Server & Database

1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file inside `server/` (refer to `.env.example`):
   ```env
   PORT=8000
   DATABASE_URL="postgresql://postgres:password@localhost:5432/taskflow_db?schema=public"
   ```

3. Run Prisma schema push to generate database tables:
   ```bash
   npx prisma db push
   ```

4. Seed database with initial sample datasets (teams, projects, users, tasks):
   ```bash
   npm run seed
   ```

5. Launch Express API development server:
   ```bash
   npm run dev
   # API running at: http://localhost:8000
   ```

---

### Step 3: Configure Client Application

1. Open a new terminal window, navigate to the client folder, and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Create a `.env.local` file inside `client/`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

3. Launch Next.js client development server:
   ```bash
   npm run dev
   # App running at: http://localhost:3000 (or http://localhost:3001)
   ```

---

## ☁️ Cloud Deployment Playbook

### Frontend Deployment (AWS Amplify Hosting)
1. Navigate to the [AWS Amplify Console](https://console.aws.amazon.com/amplify).
2. Connect your GitHub repository and select the `main` branch.
3. Configure monorepo settings with `appRoot` set to `client`:
   ```yaml
   version: 1
   applications:
     - appRoot: client
       frontend:
         phases:
           preBuild:
             commands:
               - npm ci
           build:
             commands:
               - npm run build
         artifacts:
           baseDirectory: .next
           files:
             - '**/*'
         cache:
           paths:
             - node_modules/**/*
   ```
4. Set Environment Variable `NEXT_PUBLIC_API_BASE_URL` to your production API URL and deploy.

### Backend API Deployment (AWS EC2 + PM2)
1. Launch an Amazon EC2 instance (Ubuntu Server 22.04 LTS).
2. SSH into your instance and install Node.js and PM2:
   ```bash
   curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
3. Clone repository, install dependencies, and build TypeScript:
   ```bash
   git clone https://github.com/sivansrawat/TaskFlow.git
   cd TaskFlow/server
   npm install
   npm run build
   ```
4. Start process manager daemon:
   ```bash
   pm2 start dist/index.js --name "taskflow-api"
   pm2 startup
   pm2 save
   ```

### Database Clustering (AWS RDS PostgreSQL)
1. Launch an Amazon RDS PostgreSQL instance.
2. Update security group inbound rules to allow port `5432` access from your EC2 instance.
3. Update `DATABASE_URL` in `server/.env` and execute `npx prisma db push`.

---

## 🔍 System Verification & Build Checks

Execute the following commands to confirm full compilation integrity across the workspace:

### 1. Server TypeScript Compilation Check
```bash
cd server
npm run build
```

### 2. Client Production Build & Static Page Generation
```bash
cd client
npm run build
```

### 3. Database Schema Status
```bash
cd server
npx prisma status
```

---

## 📂 Complete Directory Structure Map

```plaintext
TaskFlow/
├── client/                     # Next.js 14 Frontend Application
│   ├── public/                 # Static public assets (avatars, icons, logos)
│   ├── src/
│   │   ├── app/                # Next.js App Router Pages & Layouts
│   │   │   ├── home/           # Main Workspace Dashboard & Charts
│   │   │   ├── priority/       # Task Priority Filters (Urgent, High, Medium, Low, Backlog)
│   │   │   ├── projects/       # Project Workspace Views (Board, List, Table, Timeline)
│   │   │   ├── search/         # Global Search Page
│   │   │   ├── settings/       # User Settings Page
│   │   │   ├── teams/          # Teams & Member Allocation Page
│   │   │   ├── timeline/       # Global Projects Gantt Roadmap
│   │   │   ├── users/          # Team Users Directory Page
│   │   │   ├── authProvider.tsx # Reactive Auth Provider & Dark Auth Modal
│   │   │   ├── dashboardWrapper.tsx # Workspace Shell Layout (Sidebar + Navbar)
│   │   │   ├── globals.css     # Tailwind imports & Gantt CSS overrides
│   │   │   ├── layout.tsx      # Root HTML Layout & Font configuration
│   │   │   ├── page.tsx        # Homepage entry point
│   │   │   └── redux.tsx       # Redux Toolkit store provider
│   │   ├── components/         # Reusable Component Library
│   │   │   ├── Header/         # Section Header Component
│   │   │   ├── LandingPage/    # Dark-mode Landing Showcase & Interactive Demo
│   │   │   ├── Logo/           # TaskFlow Brand Logo SVG
│   │   │   ├── Modal/          # Generic Modal wrapper
│   │   │   ├── ModalNewProject/# Create Project Dialog
│   │   │   ├── ModalNewTask/   # Create Task Dialog
│   │   │   ├── ModalNewTeam/   # Create Team Dialog
│   │   │   ├── Navbar/         # Top Navigation Header Bar
│   │   │   └── Sidebar/        # Left Navigation Sidebar with Team Badges
│   │   ├── lib/                # Utility classes & DataGrid style tokens
│   │   └── state/
│   │       └── api.ts          # RTK Query API slice definitions & caching
│   ├── next.config.mjs         # Next.js configuration
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   ├── tsconfig.json           # Client TypeScript configuration
│   └── package.json            # Client dependencies & scripts
│
├── server/                     # Express REST API Gateway
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (User, Team, Project, Task, Comment)
│   │   ├── seed.ts             # Database seed script
│   │   └── seedData/           # Static JSON datasets (team, project, user, task)
│   ├── src/
│   │   ├── controllers/        # Request controllers (project, task, user, team, search)
│   │   ├── routes/             # Route definitions (project, task, user, team, search)
│   │   └── index.ts            # Express server entrypoint & global error middleware
│   ├── tsconfig.json           # Server TypeScript configuration
│   └── package.json            # Server dependencies & scripts
│
├── README.md                   # System Documentation
└── .gitignore                  # Git ignore rules
```

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

<p align="center">Made with ⚡ for high-performance project & team management</p>
