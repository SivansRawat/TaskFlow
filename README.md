# ✨ TaskFlow: Your Ultimate Productivity Hub ✨

**Organize. Prioritize. Conquer.**  
TaskFlow is a state-of-the-art, full-stack project management application designed for seamless team collaboration and streamlined productivity. Built with a modern tech stack and leveraging cloud services, TaskFlow enables users to visually track tasks, prioritize deliverables, and stay aligned on project timelines.

---

## 📖 Table of Contents
- [✨ TaskFlow: Your Ultimate Productivity Hub ✨](#-taskflow-your-ultimate-productivity-hub-)
  - [📖 Table of Contents](#-table-of-contents)
  - [🚀 Key Features](#-key-features)
  - [🛠️ Tech Stack Matrix](#️-tech-stack-matrix)
  - [🌐 System Architecture](#-system-architecture)
  - [📁 Repository Structure](#-repository-structure)
  - [⚙️ Local Setup Guide](#️-local-setup-guide)
    - [Prerequisites](#prerequisites)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Server Configuration \& Setup](#2-server-configuration--setup)
    - [3. Client Configuration \& Setup](#3-client-configuration--setup)
  - [🔌 API Endpoints Reference](#-api-endpoints-reference)
  - [☁️ AWS Deployment Guidelines](#️-aws-deployment-guidelines)
    - [Frontend Deployment (AWS Amplify)](#frontend-deployment-aws-amplify)
    - [Backend Deployment (AWS EC2 + PM2)](#backend-deployment-aws-ec2--pm2)
    - [Database Deployment (AWS RDS PostgreSQL)](#database-deployment-aws-rds-postgresql)
  - [🤝 Contributing Guidelines](#-contributing-guidelines)
  - [📄 License](#-license)

---

## 🚀 Key Features

*   🎯 **Smart Task Prioritization**: Assign tasks with urgency/priority tags (`Urgent`, `High`, `Medium`, `Low`, `Backlog`) to keep work focused.
*   📈 **Multiple Interactive Views**:
    *   **Dashboard View**: High-level statistical summary using Recharts charts and data visualization widgets.
    *   **Kanban Board**: Drag-and-drop tasks seamlessly through workflow stages (`To Do`, `Work In Progress`, `Under Review`, `Completed`).
    *   **Gantt Chart Timeline**: Visual interactive timelines powered by `gantt-task-react` to plan task durations and milestones.
    *   **Data Grid View**: Tabular list of tasks built with Material UI's `@mui/x-data-grid` featuring robust searching, sorting, and filtering.
*   🔐 **Secure Cognito Authentication**: Ironclad login, registration, and user sessions powered by AWS Cognito and AWS Amplify.
*   🔎 **Unified Global Search**: Easily locate tasks, projects, and team members instantly.
*   🌗 **Modern Responsive UI**: Built with Tailwind CSS and styled components, complete with standard Light and Dark modes.
*   🗂️ **Detailed Project Management**: Create and track multiple projects, assign tasks to specific users, and manage team scopes.

---

## 🛠️ Tech Stack Matrix

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Next.js 14](https://nextjs.org/) | React framework with Server-Side Rendering (SSR) & Static Site Generation (SSG). |
| | [Redux Toolkit](https://redux-toolkit.js.org/) | Global state management and RTK Query for efficient API data fetching & caching. |
| | [Tailwind CSS](https://tailwindcss.com/) / [MUI](https://mui.com/) | Modern UI component styling and standard theme-switching. |
| | [AWS Amplify (Auth SDK)](https://aws.amazon.com/amplify/) | Client-side integration with AWS Cognito User Pools. |
| **Backend** | [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) | High-performance RESTful API gateway backend written in TypeScript. |
| | [Prisma ORM](https://www.prisma.io/) | Next-generation Node.js and TypeScript ORM for robust PostgreSQL interactions. |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Relational database to store projects, tasks, user profiles, comments, and attachments. |
| **Infrastructure** | [AWS Cognito](https://aws.amazon.com/cognito/) | Fully managed user authentication and verification. |
| | [AWS EC2](https://aws.amazon.com/ec2/) | Secure, scalable cloud compute instances hosting the Express API. |
| | [AWS Amplify Hosting](https://aws.amazon.com/amplify/) | CI/CD-driven serverless hosting for Next.js web application. |
| | [Amazon S3](https://aws.amazon.com/s3/) (Optional) | Secure bucket storage for task attachments and profile images. |

---

## 🌐 System Architecture

The following diagram illustrates how clients authenticate and interact with the backend API and storage layer:

```mermaid
graph TD
    subgraph Client ["Client Side (Next.js & Redux Toolkit)"]
        Browser["User's Browser"]
        NextJS["Next.js App (Amplify Hosted)"]
        Redux["Redux / RTK Query"]
        CognitoAuth["Amplify Auth (Cognito)"]
    end

    subgraph Server ["Server Side (Express & Node.js)"]
        ExpressApp["Express Node.js Server (EC2 Hosted)"]
        Prisma["Prisma ORM"]
    end

    subgraph Storage ["Data & Storage Layer"]
        DB[(PostgreSQL Database on AWS RDS)]
        S3["Amazon S3 (File Storage)"]
        Cognito["Amazon Cognito (User Pool)"]
    end

    Browser -->|1. Render / Route| NextJS
    NextJS -->|2. Manage State & Cache| Redux
    NextJS -->|3. Sign-in / Sign-up| CognitoAuth
    CognitoAuth <-->|AWS SDK Authentication| Cognito

    Redux -->|4. API Requests with JWT Bearer Token| ExpressApp
    ExpressApp -->|5. Read / Write Data| Prisma
    Prisma <-->|SQL Queries| DB
    ExpressApp -->|6. File Uploads / Attachments| S3
```

---

## 📁 Repository Structure

```plaintext
TaskFlow/
├── client/                     # Next.js Frontend Application
│   ├── public/                 # Static assets (icons, images)
│   ├── src/
│   │   ├── app/                # Next.js App Router (Layouts & Pages)
│   │   ├── components/         # Reusable UI Components (Navbar, Sidebar, Cards)
│   │   ├── lib/                # Utility modules and styling classes
│   │   └── state/              # Redux Store config and RTK Query API slices
│   ├── tailwind.config.ts      # Tailwind styling configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json            # Frontend script actions & dependencies
│
├── server/                     # Express Backend API
│   ├── prisma/                 # Prisma database configuration and schemas
│   │   ├── schema.prisma       # Database models declarations
│   │   ├── seed.ts             # Initial database seed script
│   │   └── seedData/           # Static JSON datasets for initial seeding
│   ├── src/
│   │   ├── controllers/        # Request handlers & controller logic
│   │   ├── routes/             # Express route definitions
│   │   └── index.ts            # Entrypoint file starting the Express application
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json            # Backend script actions & dependencies
│
└── README.md                   # Project documentation
```

---

## ⚙️ Local Setup Guide

Follow these steps to configure and run the TaskFlow environment locally:

### Prerequisites
Make sure you have the following installed on your machine:
*   [Node.js (v18+)](https://nodejs.org/) & `npm`
*   [PostgreSQL (v14+)](https://www.postgresql.org/) database server
*   An active [AWS Cognito User Pool](https://aws.amazon.com/cognito/) (for user authentication)

---

### 1. Clone the Repository
```bash
git clone https://github.com/sivansrawat/TaskFlow.git
cd TaskFlow
```

---

### 2. Server Configuration & Setup
1. Navigate to the `server/` directory and install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in the root of the `server/` directory:
   ```env
   PORT=8000
   DATABASE_URL="postgresql://db_user:db_password@localhost:5432/taskflow_db?schema=public"
   ```
   *Replace `db_user` and `db_password` with your local PostgreSQL credentials.*

3. Run the Prisma migration script to generate database schema tables:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Seed the database with sample projects, tasks, and users:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will start running at `http://localhost:8000`.

---

### 3. Client Configuration & Setup
1. In a new terminal window, navigate to the `client/` directory and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Create a `.env.local` file in the root of the `client/` directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_COGNITO_USER_POOL_ID=your_cognito_user_pool_id
   NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=your_cognito_client_id
   NEXT_PUBLIC_COGNITO_DOMAIN=your_cognito_domain.auth.aws-region.amazoncognito.com
   ```
   *Replace the cognito variables with your actual AWS Cognito settings.*

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` to view the running web application.

---

## 🔌 API Endpoints Reference

All API requests sent from the client must append a valid Cognito Identity/Access Token in the headers:
`Authorization: Bearer <ID_TOKEN>`

### Projects
*   `GET /projects` - Retrieves all projects.
*   `POST /projects` - Creates a new project.
    *   *Body payload*: `{ name: string, description?: string, startDate?: string, endDate?: string }`

### Tasks
*   `GET /tasks?projectId=X` - Retrieves all tasks assigned under a specific project ID.
*   `POST /tasks` - Creates a new task.
    *   *Body payload*: `{ title: string, description?: string, status?: string, priority?: string, tags?: string, startDate?: string, dueDate?: string, points?: number, projectId: number, authorUserId: number, assignedUserId?: number }`
*   `PATCH /tasks/:taskId/status` - Updates a task status.
    *   *Body payload*: `{ status: string }`
*   `GET /tasks/user/:userId` - Retrieves all tasks assigned to a specific user.

### Users
*   `GET /users` - Retrieves all registered user accounts.
*   `POST /users` - Registers a new user session mapping to Cognito database.
    *   *Body payload*: `{ username: string, cognitoId: string, profilePictureUrl?: string, teamId?: number }`
*   `GET /users/:cognitoId` - Retrieves a single user record by their unique Cognito identifier.

### Teams
*   `GET /teams` - Retrieves all existing team boards.

### Search
*   `GET /search?query=XYZ` - Globally searches titles, descriptions, and usernames across projects, tasks, and users.

---

## ☁️ AWS Deployment Guidelines

### Frontend Deployment (AWS Amplify)
1. Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify).
2. Connect your GitHub repository containing the `TaskFlow` project.
3. Select the branch to deploy (`main`).
4. Configure the Build settings. Since it's a monorepo, define the `appRoot` as `client` in the build settings:
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
5. In the Amplify console, add the required Environment Variables (`NEXT_PUBLIC_API_BASE_URL`, etc.).
6. Save and deploy. Amplify will automatically compile and serve Next.js globally.

### Backend Deployment (AWS EC2 + PM2)
1. Launch an Amazon EC2 instance (Amazon Linux 2 or Ubuntu Server) and open ports `80` (HTTP) or `8000` (or reverse proxy with Nginx).
2. SSH into your EC2 instance and install Node.js, Git, and PM2 globally:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   . ~/.nvm/nvm.sh
   nvm install --lts
   npm install pm2 -g
   ```
3. Clone the code, navigate to `server/`, create the `.env` file, and install dependencies:
   ```bash
   git clone https://github.com/sivansrawat/TaskFlow.git
   cd TaskFlow/server
   npm install
   npm run build
   ```
4. Start your process daemon using PM2 to keep the server running continuously:
   ```bash
   pm2 start dist/index.js --name "taskflow-api"
   pm2 startup
   pm2 save
   ```

### Database Deployment (AWS RDS PostgreSQL)
1. Create a PostgreSQL RDS instance through the AWS RDS Console.
2. Configure Security Groups to allow inbound database access (port `5432`) from your EC2 Instance's IP/security group.
3. Obtain the connection string from AWS RDS, update your server's `.env` configuration file `DATABASE_URL` target, and run your migration:
   ```bash
   npx prisma db push
   ```

---

## 🤝 Contributing Guidelines

We welcome contributions of all forms! To contribute:
1. Fork this repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request for review.

Please ensure all tests pass and follow code styling formatting conventions.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use and distribute it as needed.
