# 🤖 SQL_AGENT - AI-Powered Database Assistant

An intelligent chat-based interface that allows users to query a database using natural language and get structured, visually formatted results in real-time.

---

## ✨ Overview

This project is a modern AI-powered database assistant that transforms user queries into SQL commands and displays results in a clean, structured UI.

Instead of writing SQL manually, users can simply ask questions like:

> “Can you show me a list of users”
> “List all products with price above 5000”

…and the system handles everything — from query generation to result .

---

## 🔥 Key Features

* 💬 **Chat-Based Interface** – Interact with your database like one on one chat .
* 🧠 **AI Query Generation** – Converts natural language → SQL queries .
* 📊 **Structured Data Rendering** – Results displayed in clean tables .
* 🧾 **Schema Awareness** – AI understands database structure before any querying .
* ⚡ **Real-Time Processing** – Instant responses with step-by-step execution .

---

## 🛠️ Tech Stack

### Frontend

* Nextjs + TypeScript
* Tailwind CSS

### AI Layer

* Vercel AI SDK (`@ai-sdk/react`)
* OpenAI API

### Backend / Data

* SQL Database (Turso / SQLite)
* Server-side query execution

---

## 🧩 How It Works

1. User enters a natural language query
2. AI processes the query and understands intent
3. Schema is loaded for context
4. SQL query is generated automatically
5. Query is executed on the database
6. Results are returned and displayed 


## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AnujBhagat08/sql-agent
cd sql-agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env.local` file:

```env
1. OPENAI_API_KEY = your_api_key_here

2. TURSO_AUTH_TOKEN = your_auth_token_here

3. TURSO_DATABASE_URL = your_db_url_here
```

---

### 4. Run the development server

```bash
npm run dev
```

---
 ## 📂 Project Structure

```bash
    SQL-AGENT/
    ├── .next/
    ├── .vscode/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── app/
    │   │   ├── api/
    │   │   │   └── chat/ 
    │   │   │       └── route.ts
    │   │   ├── favicon.ico
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── db/
    │       ├── migrations/
    │       │   └── meta/
    │       │       ├── _journal.json
    │       │       ├── 0000_snapshot.json
    │       │       └── 0000_nasty_johnny_storm.sql
    │       ├── db.seed.ts
    │       ├── db.ts
    │       └── schema.ts
    ├── .env.local
    ├── .gitignore
    ├── AGENTS.md
    ├── CLAUDE.md
    ├── drizzle.config.ts
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.mjs
    ├── README.md
    └── tsconfig.json
```

```

```

---

## 🎯 Use Cases - where we can use this project

* Internal admin dashboards
* Data exploration tools
* AI-powered analytics assistants
* Developer productivity tools

---

## 🧠 Future Improvements

* 🔍 Table filtering & search 
* 📄 Pagination support
* 📊 Data visualization (charts)
* 📥 Export to CSV / Excel
* 🔐 Authentication & user roles
* 🧾 Query history

---

## 💡 Why This Project?

This project demonstrates:

* Real-world AI integration
* Full-stack development skills
* Data handling & visualization
* Practical problem-solving approach

---

## 👨‍💻 Author

**Anuj Bhagat**

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

---
