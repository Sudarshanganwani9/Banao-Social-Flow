# 🚀 Social Flow

A modern social media web app built with React (Vite + TypeScript), Tailwind CSS, ShadCN UI, and Supabase for authentication and database.


---

## 📌 Features

🔐 Authentication (Register, Login, Forgot Password)

📝 Social Feed – posts, likes, and comments

⚡ Real-time Updates via Supabase

🎨 Modern UI with ShadCN + Tailwind

📱 Responsive Design (mobile & desktop)

🗂️ Modular and scalable project structure



---

## 🛠️ Tech Stack

Frontend: React (Vite + TypeScript), Tailwind CSS, ShadCN UI

Backend & DB: Supabase (Postgres + Auth)

Build Tooling: Vite, ESLint

Package Manager: npm / bun / yarn



---

## 📂 Project Structure

Banao-Social-Flow-main/
│── .env
│── package.json
│── vite.config.ts
│── tailwind.config.ts
│── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── pages/
│       ├── Login.tsx
│       ├── Register.tsx
│       ├── ForgotPassword.tsx
│       └── NotFound.tsx
│── supabase/
│   ├── config.toml
│   └── migrations/
└── public/
    ├── favicon.ico
    └── robots.txt


---

## ⚙️ Installation & Setup

1. Clone the repo



git clone https://github.com/<your-username>/Banao-Social-Flow.git
cd Banao-Social-Flow-main

2. Install dependencies



npm install
 or
yarn install
 or
bun install

3. Set environment variables
Create a .env file in the root:



VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>

4. Start development server



npm run dev


---

## 📜 Available Scripts

npm run dev → Start development server

npm run build → Build for production

npm run preview → Preview production build

npm run lint → Run ESLint checks



---

## 🧩 Database (Supabase)

Configure Supabase using supabase/config.toml

Run migrations from supabase/migrations/

Use Supabase Dashboard to manage authentication & database



---

## 🤝 Contributing

1. Fork the repository


2. Create a feature branch:

git checkout -b feature/amazing-feature


3. Commit changes and push


4. Open a Pull Request 🚀

