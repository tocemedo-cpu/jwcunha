# Jelson & Wilson Cunha — corporate website

Corporate website for facility, property, waste and supplies & procurement services to the oil & gas sector.

| Layer | Stack |
|---|---|
| Backend | Java 21, Spring Boot 3.5, Spring Data JPA/Hibernate, Flyway, Spring Security, Maven |
| Database | PostgreSQL 16 |
| Frontend | React 19, TypeScript, Vite, React Router |
| Runtime | Docker, Docker Compose, Nginx (static files + reverse proxy to the API) |

```
backend/    Spring Boot API (contact form, admin API, Flyway migrations in src/main/resources/db/migration)
frontend/   React SPA, copy in src/content (en.ts; pt.ts ready for translation), nginx/default.conf
docker-compose.yml, .env.example
```

## What the site does
- 10 content areas: Home, About, Facility / Property / Waste / Supplies & Procurement, Sectors, HSE & Quality, Mobilisation, Contact; plus a 404 page, mobile menu and footer.
- `POST /api/contact` validates the request, stores it in PostgreSQL and returns `201` with a reference **only after the row is committed**. The UI shows success only on that response.
- Spam controls: honeypot field and per-IP rate limit (`RATE_LIMIT_MAX` per `RATE_LIMIT_WINDOW_SECONDS`, in-memory, single instance).
- Admin API (HTTP Basic, single account from environment, no default credentials; locked when unset):
  `GET /api/admin/requests?page=0&size=20`, `GET /api/admin/requests/{id}`, `PATCH /api/admin/requests/{id}/status` with `{"status":"NEW|IN_REVIEW|RESPONDED|CLOSED"}`.
- Everything else under `/api` is denied; only `/actuator/health` is exposed.
- No client names, contracts, certifications, licences, statistics or years of experience are published. Public email/phone/address appear only if configured.

## Run with Docker (recommended)

**Linux / macOS**
```bash
cp .env.example .env          # then edit .env (at least POSTGRES_PASSWORD)
docker compose up --build -d
# open http://localhost   (HTTP_PORT in .env to change)
```

**Windows PowerShell**
```powershell
Copy-Item .env.example .env   # then edit .env (at least POSTGRES_PASSWORD)
docker compose up --build -d
Start-Process http://localhost
```

### Admin account
Generate a bcrypt hash (min. 12 characters; the password is read from stdin so it stays out of shell history on Linux):
```bash
# Linux (needs Java 21 and the built jar: cd backend && mvn -DskipTests package)
read -rs PW && echo "$PW" | java -jar backend/target/website-1.0.0.jar hash-password
```
```powershell
# PowerShell
$pw = Read-Host "Admin password" -AsSecureString
[Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pw)) | java -jar backend\target\website-1.0.0.jar hash-password
```
Put the result in `.env` in **single quotes**: `ADMIN_PASSWORD_HASH='$2a$12$...'` and set `ADMIN_USERNAME`. Query it (the API is reachable through Nginx):
```bash
curl -u admin http://localhost/api/admin/requests
```
Always use HTTPS in production: Basic credentials are otherwise sent in clear text.

## Local development (without Docker)
Requirements: JDK 21, Maven 3.9+, Node 20+ (build tool only), PostgreSQL 16.

```bash
# database (once)
createdb jwc_dev   # and a role, e.g. CREATE USER jwc PASSWORD '...' ; GRANT ALL ... ; owner of the DB
# backend (http://localhost:8080) — Flyway migrates on start
cd backend
DB_URL=jdbc:postgresql://localhost:5432/jwc_dev DB_USER=jwc DB_PASSWORD=... mvn spring-boot:run
# frontend (http://localhost:5173, /api proxied to :8080)
cd frontend && npm install && npm run dev
```
PowerShell: set variables with `$env:DB_URL="..."; $env:DB_USER="..."; $env:DB_PASSWORD="..."` before `mvn spring-boot:run`.

## Tests
```bash
# Backend: integration tests need a PostgreSQL database (defaults: jdbc:postgresql://localhost:5432/jwc_test, user jwc).
# Override with TEST_DB_URL / TEST_DB_USER / TEST_DB_PASSWORD.
cd backend && mvn test
# Frontend
cd frontend && npm test && npm run build
```

## Photography
See `frontend/src/assets/photos/README.md` for the shot list. Without photos a neutral placeholder is shown.

## Adding Portuguese
Fill `frontend/src/content/pt.ts` (same shape as `en.ts`; missing keys fall back to English), then set `enabled: true` for `pt` in `frontend/src/i18n/locales.ts`. A language selector appears automatically. The form already submits the active language.

## Production checklist
1. Server with Docker + Compose; DNS A/AAAA record for the domain.
2. Create `.env` with strong unique secrets; `PUBLIC_ORIGIN=https://your-domain`; set `HTTP_PORT` (e.g. `8080`) if a host proxy fronts the stack.
3. Terminate TLS in front of the `frontend` container (Caddy/Traefik/host Nginx with Let's Encrypt, or a cloud load balancer) and forward `X-Forwarded-*` headers; redirect HTTP→HTTPS and enable HSTS there.
4. Add real photography, contact details (`PUBLIC_*`) and a privacy notice / terms reviewed by the company's legal adviser.
5. Back up the `pgdata` volume (`pg_dump` on a schedule) and test a restore.
6. Keep the database unpublished (Compose does not expose it) and restrict SSH/firewall to 80/443.
7. Monitor `/actuator/health`; ship container logs somewhere durable. Rebuild images regularly for security updates.
8. If the API is ever scaled beyond one instance, move the rate limiter to a shared store.
