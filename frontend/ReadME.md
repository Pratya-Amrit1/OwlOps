# 🦉 OwlOps — Lightweight Observability for Indie Devs

OwlOps is a privacy-first, self-hosted observability tool for monitoring APIs, services, and endpoints in real time — without SaaS lock-in, heavy infrastructure, or external telemetry.

It is designed for indie developers, small projects, and self-hosted stacks where simplicity, control, and low resource usage matter more than enterprise complexity.

---

## ✨ Features

- ⚡ Real-time monitoring via Server-Sent Events (SSE)
- 📈 Rolling latency charts (last 30 checks)
- 🔔 Smart email alerts on consecutive failures
- 🌐 HTTP, HTTPS, WS, and WSS monitoring
- 🧾 Custom method, headers, body, and expected status
- 🗄️ SQLite storage (zero setup, single file DB)
- 🔒 Fully self-hosted (no external calls, no telemetry)
- 🐳 Docker-first deployment (lightweight & portable)

---

## 🏗️ How the Three Layers Work

### 1️⃣ Frontend (Dashboard)
- Built with React + TypeScript.  
- Connects to the backend using SSE (`/events`).  
- Displays live status, latency, and history charts in real time.  
- No polling, no refresh — updates stream instantly.  

### 2️⃣ Backend (Monitoring Engine)
- Built with Node.js + Express.  
- Uses a recursive `setTimeout` scheduler to ping endpoints safely.  
- Prevents overlapping requests and keeps checks deterministic.  
- Handles alert logic, status evaluation, and event streaming.  

### 3️⃣ Storage (SQLite)
- Lightweight file-based database (`/data`).  
- Stores monitor configs, results, and latency history.  
- Zero external database required.  
- Easy backups and perfect for single-node self-hosted setups.
- Automatic cleanup, old results are pruned after 10,000 entries per monitor


## File Structure

```text
owlops-self-hosted/
├── backend/
│   ├── data/
│   │   └── owlops.db              # SQLite database (persistent storage)
│   ├── dist/                     # Compiled backend output
│   ├── node_modules/
│   ├── src/
│   │   ├── events/
│   │   │   └── broadcaster.ts    # SSE broadcaster
│   │   ├── routes/
│   │   │   ├── events.ts         # /events (SSE stream)
│   │   │   └── monitors.ts       # monitor CRUD routes
│   │   ├── scheduler/
│   │   │   └── index.ts          # recursive setTimeout scheduler
│   │   ├── services/
│   │   │   ├── cleanup.ts        # automatic cleanup logic
│   │   │   ├── httpHandler.ts    # HTTP/HTTPS checks
│   │   │   ├── wsHandler.ts      # WS/WSS checks
│   │   │   ├── sendMail.ts       # email alert service (SMTP)
│   │   │   ├── settings.ts       # config & runtime settings
│   │   │   └── shutdownHandler.ts# graceful shutdown logic
│   │   ├── db.ts                 # SQLite connection
│   │   ├── schema.ts             # database schema
│   │   └── server.ts             # Express server entry
│   ├── example-env               # env template
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── tsconfig.tsbuildinfo
│
├── frontend/
│   ├── dist/                     # built frontend (Vite)
│   ├── node_modules/
│   ├── public/
│   │   └── owlops.svg            # app asset/logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── GraphModal.tsx
│   │   │   ├── MailComponent.tsx
│   │   │   ├── ModalComponent.tsx
│   │   │   └── TitleScreen.tsx
│   │   ├── App.tsx               # main app
│   │   ├── Dashboard.tsx         # monitoring dashboard UI
│   │   ├── main.tsx              # React entry point
│   │   ├── App.css
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── tsconfig.json
│   ├── package.json
│   └── package-lock.json
│
├── Dockerfile                   # multi-stage build (frontend + backend)
├── docker-compose.yml           # self-host deployment config
├── .dockerignore
├── .gitignore
└── ReadME.md
```



## 🚀 Setup (Self-Hosted via Docker)

### 1️⃣ Fetch the Docker Compose file
```bash
curl -fsSL https://raw.githubusercontent.com/Pratya-Amrit1/OwlOps/main/docker-compose.yml -o docker-compose.yml
```
### 2️⃣ Configure the Docker Compose file
1. Open the compose file:
```bash
nano docker-compose.yml
```
or 
```bash
vi docker-compose.yml
```

2. Update the required environment variables:

- TZ → Your timezone (e.g. Asia/Kolkata, UTC)

- PORT → Dashboard port (default: 3000)

- SMTP_HOST → SMTP provider (e.g. smtp.gmail.com) *(required)*

- SMTP_PORT → Usually 587

- SMTP_USER → Sender email for alerts  *(required)*

- SMTP_PASS → App password (NOT your real email password)  *(required)*

Example:
```bash
services:
  owlops:
    image: pratya168/owlops-monitoring:latest
    ports:
      - "3000:3000"
    volumes:
      - owlops-data:/app/data
    environment:
      - DEFAULT_TIMEZONE=Asia/Kolkata
      - PORT=3000
      - NODE_ENV=production
      - DOCKER=true
      - SMTP_HOST=smtp.gmail.com
      - SMTP_PORT=587
      - SMTP_USER=yourmail@gmail.com
      - SMTP_PASS=16-char-app-pass
      - SMTP_FROM=OwlOps Monitor
```
- 📬 For SMTP setup, follow the steps below.

3.  Start OwlOps
```bash
docker compose up --build -d
```
- Then open:  http://localhost:3000

### 📬 SMTP Setup (Gmail Example)

- OwlOps uses SMTP to send downtime alert emails.
If you are using Gmail, you must use an App Password (not your normal password).

1. Enable 2-Step Verification
- Go to: https://myaccount.google.com/security

- Enable 2-Step Verification on your Google account

2. Generate an App Password
- Visit: https://myaccount.google.com/apppasswords

- Name your app. (eg. owlops)

- Click Generate

- You will get a 16-character password like:

- ex: abcd efgh ijkl mnop

3. Add Credentials to Docker Compose
- Paste your email and the generated app password into the compose file:
```bash
environment:
  SMTP_HOST: smtp.gmail.com
  SMTP_PORT: 587
  SMTP_USER: your-email@gmail.com
  SMTP_PASS: abcdefghijklmnop (remove spaces)
```
## ⚠️ Do NOT use your real Gmail password.
- App Passwords are required when 2FA is enabled for SMTP authentication.

## License

MIT © 2026 Pratya Amrit
