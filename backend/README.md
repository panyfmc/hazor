# Hazor Backend

API Express + SQL Server para o sistema Hazor.

## Pré-requisitos

- Node.js
- Docker Desktop

## Configuração

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Ajuste as variáveis em `.env` se necessário. O padrão funciona com o Docker Compose deste diretório:

```env
PORT=3000

DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=SuaSenhaForte123!
DB_DATABASE=hazor
```

## Banco de dados (Docker)

Na pasta `backend`:

```bash
npm run db:up
```

Isso sobe o SQL Server e executa `db/init.sql` (cria o banco `hazor`, as tabelas e dados iniciais).

| Script        | Descrição                                      |
|---------------|------------------------------------------------|
| `npm run db:up`    | Sobe o SQL Server e roda o init           |
| `npm run db:down`  | Para os containers                        |
| `npm run db:reset` | Apaga o volume e sobe tudo do zero        |
| `npm run db:logs`  | Acompanha os logs do SQL Server           |

## Rodar a API

```bash
npm install
npm start
```

Para desenvolvimento com reload automático:

```bash
npm run dev
```

A API sobe em `http://localhost:3000` (ou a porta definida em `PORT`).

Rotas principais:

- `GET /alunos`
- `GET /igrejas`
- `GET /regioes`
- `GET /grupos`
- `GET /temporadas`
- `GET /aulas`
- `GET /atividades`

O `db/init.sql` também cria temporada, oficinas (incl. Fotografia em 10/07/2026) e presenças de exemplo.
