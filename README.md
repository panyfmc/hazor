# Hazor

Sistema de gestão de alunos (frontend Angular + backend Express/SQL Server).

## Estrutura

- [`backend/`](./backend) — API Node.js + SQL Server (Docker)
- [`frontend/`](./frontend) — aplicação Angular

## Início rápido

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:up
npm start
```

Detalhes em [backend/README.md](./backend/README.md).

### Frontend

```bash
cd frontend
npm install
npm start
```

Detalhes em [frontend/README.md](./frontend/README.md).
