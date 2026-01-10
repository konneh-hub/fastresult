# ResultApp Backend (TypeScript + Express + TypeORM)

This backend implements the RBAC and workflow for university results as specified.

## Quickstart (development)

1. Ensure Docker is running (or have a MySQL instance available on 127.0.0.1:3306).
2. Start services: `docker compose up --build -d`
3. Run migrations (specifying the data source file):
   - `npm run migration:run`
4. Seed the database with test users:
   - `npm run seed`
5. Run dev server: `npm run dev`

For a quick UI demo without a DB, start the server in mock mode (no DB required):
- PowerShell: `$env:SKIP_DB='true'; npm run dev`
- bash: `SKIP_DB=true npm run dev`

Notes:
- The docker compose file will create a MySQL 8.0 instance with `MYSQL_ROOT_PASSWORD=password` and database `resultapp`.
- If you run a local MySQL instance instead, set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, and `DB_NAME` accordingly before running migrations.

## Key files

- `src/entities` - TypeORM entities (`User`)
- `src/migrations` - DB migrations (initial schema)
- `src/routes` - Express routes (auth, ...)
- `src/middleware` - `authMiddleware`, `authorize` middleware

## Roles and responsibilities

See the project README in root for detailed role descriptions and workflow.

## Notes

- Use `JWT_SECRET` env var (currently `supersecret` in docker-compose).
- Migrations create `users`, `faculties`, `departments`, `courses`, `students`, `results`, `audit_logs`.
