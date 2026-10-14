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
- Admin API and page `/admin` (HTTP Basic, single account from environment, no default credentials; locked when unset). See *Proposal requests: storage and e-mail alerts*.
- Everything else under `/api` is denied; only `/actuator/health` is exposed.
- No client names, contracts, certifications, licences, statistics or years of experience are published. The public email, address and tax ID are in `frontend/src/lib/company.ts` (email and address can be overridden at build time); no telephone number is published until the company supplies one.

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
   - If sign-in fails with a correct password, read the backend log at start-up: it says `Admin account '…' is configured.` or why the admin is locked (empty variable, or `ADMIN_PASSWORD_HASH is not a valid bcrypt hash`, with its length). A valid hash has exactly 60 characters and starts with `$2a$`. Spaces, line breaks and one pair of quotes around `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` are ignored; in hosting dashboards paste the hash **without** quotes. The hash is never written to the log.
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

## Proposal requests: storage and e-mail alerts
1. The form posts to `POST /api/contact`; the server validates it and saves it in PostgreSQL (table `proposal_request`). Only after the row is committed does the visitor see "Request received" and a reference code.
2. **E-mail alert (optional).** When `MAIL_ENABLED=true` and `MAIL_HOST`, `MAIL_FROM` and `MAIL_NOTIFY_TO` are set, each new request triggers a plain-text e-mail (in Portuguese) to the recipients in `MAIL_NOTIFY_TO` (comma-separated). *Reply* answers the visitor directly (Reply-To is the visitor's address).
   - It is sent **after** the request is saved, in the background: a slow or broken mail server can never delay or lose a request or change what the visitor sees.
   - If sending fails the request is marked `FAILED` and retried every 5 minutes, up to 5 attempts within 7 days. Each request records `notification_status` (`PENDING`, `SENT`, `FAILED`, `DISABLED`), the attempt count and the send time; the admin API shows `notificationStatus` / `notifiedAt`.
   - **Reminder for unanswered requests**: every weekday at 08:00 (Luanda) one digest e-mail lists the requests still in status *New* after `REMINDER_AFTER_HOURS` hours (default 48; `0` turns it off), up to 20 listed plus the total. Nothing is sent when nothing is overdue. It stores nothing: a failed send is simply tried again at the next run, and the reminder stops once the requests are moved to *In review* / *Responded* / *Closed*. It uses the same `MAIL_*` settings as the alerts, so it is off whenever those are off.
   - Requests received before alerts were switched on (or while off) are `DISABLED` and are never e-mailed retroactively.
   - Visitor text is only placed in the body (headers are sanitised), so it cannot inject headers.
   - Empty or unset mail variables are valid and mean "off" (hosting dashboards send unfilled variables as empty).
3. SMTP: use the provider's SMTP host with STARTTLS on port 587 (default; set `MAIL_SSL=true` and the provider's SSL port for implicit TLS). Credentials go in the hosting dashboard / `.env`, never in the repository. Check your hosting plan's outbound SMTP policy: some plans block ports 25/465/587; if so use the provider's alternative port (often 2525).
4. **Administration page: `/admin`** (not linked from the menu, `noindex`). Sign in with the admin account (see *Admin account*). It shows the requests with counters per status, search (name, company, e-mail, location, message, internal notes), filters by status and service, the full message, a *Reply by e-mail* link, the e-mail-alert state, a status selector (New / In review / Responded / Closed) and **Export CSV** (current filters, up to 5000 rows, including an *Internal notes* column; semicolon-separated with a UTF-8 BOM so Excel in Portuguese locales opens it correctly; cells that could run as formulas are neutralised).
   - The browser keeps the credentials only in `sessionStorage` (gone when the tab is closed); *Sign out* clears them. Use the site over HTTPS (Render provides it) so the password is never sent in clear text.
   - After 10 failed logins from one address in 15 minutes, further admin requests from it get `429` until the window passes.
   - The same data is available over the API: `GET /api/admin/requests?status=&serviceArea=&q=&page=&size=`, `GET /api/admin/requests/summary`, `GET /api/admin/requests/export.csv`, `GET /api/admin/requests/{id}`, `PATCH /api/admin/requests/{id}/status`, `DELETE /api/admin/requests/{id}`.
   - **Deleting a request** (spam, or a client asking for their data to be erased): *Delete request* in the opened request, with a confirmation step. It is permanent and also removes the request's internal notes; only the request's id is logged. Automatic retention (deleting after a fixed period) is not implemented: the period is a legal decision.
   - **Internal notes** per request (never shown to the client): open a request and use the *Internal notes* section to record who contacted the client, when and what was agreed. Each note stores the admin user and timestamp, is limited to 2000 characters, and can be deleted (with confirmation). API: `GET` / `POST /api/admin/requests/{id}/notes`, `DELETE /api/admin/requests/{id}/notes/{noteId}`. 

## Brand identity
Taken from the company's commercial profile (Oct 2026): JWC logo, brand green `#007E5A` (`--green`) and navy `#102F42` (`--navy`), bold sans-serif headlines (IBM Plex Sans, self-hosted), tagline *Cuidamos dos espaços. Valorizamos o património.* / *We care for spaces. We add value to property.*
- Logos: `frontend/src/assets/brand/logo.png` (light backgrounds) and `logo-light.png` (navy backgrounds), favicons in `frontend/public/`. The source logo is a raster image (2172 px wide); replace with an SVG if the company has one.
- Service names follow the profile: Facility Management, Property Management, Waste Management, Produtos e Fornecimentos / Products & Supplies, each with its deliverables.
- Company identification (legal name, NIF, address, licence note) comes from the commercial profile, and the public email (`jw@cunha.ao`) was supplied by the company. They live in `frontend/src/lib/company.ts`. The email and address can be overridden at build time with `VITE_CONTACT_EMAIL` / `VITE_COMPANY_ADDRESS` (`PUBLIC_*` in Docker Compose); an empty value keeps the built-in one. **There is no phone variable**: no telephone number is published, so a leftover phone value in any environment is ignored.
- Portuguese uses the company's own orthography (pre-1990: *correctiva*, *activos*, *Projecto*).
- The hero photograph is the illustrative image supplied in the profile and is captioned as such.

## Languages
The site is bilingual: **English** and **European Portuguese**. A visible `EN | PT` switch is in the header (and the mobile menu). On the first visit the browser language is used (Portuguese if it starts with `pt`, otherwise English); the choice is remembered in `localStorage` and `<html lang>` follows it. URLs are the same in both languages. The contact form sends the active language, which is stored with each request.

- Copy lives in `frontend/src/content/en.ts` (source of truth) and `frontend/src/content/pt.ts`. Components never contain hard-coded text, including photo `alt` text.
- A test (`src/test/i18n.test.tsx`) fails if any English string has no Portuguese counterpart, so nothing silently falls back.
- Add another language: create `content/xx.ts`, register it in `i18n/locales.ts` (`enabled: true`) and extend the `LocaleCode` type and the backend `language` pattern (`ProposalRequestDto`).

## Deploy on Render
`render.yaml` defines the whole stack: managed PostgreSQL 16 (`jwc-db`), a **private** Spring Boot service (`jwc-backend`) and the public Nginx + React service (`jwc-web`) that proxies `/api` to it. Render terminates TLS and provides the certificate.

1. Push the repository to GitHub and in the Render dashboard choose **New → Blueprint**, pick the repository and branch `main`.
2. When prompted, fill the `sync: false` values: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (see *Admin account*; leave empty to keep the admin API locked), `ALLOWED_ORIGINS` (`https://your-domain`) and, optionally, `VITE_CONTACT_EMAIL` / `VITE_COMPANY_ADDRESS` (build-time; leave empty to keep the built-in values). Changing them requires a redeploy of `jwc-web`.
3. Wait for `jwc-db` → `jwc-backend` → `jwc-web` to become live. Flyway creates the schema on the backend's first start.
4. **Custom domain:** `jwc-web` → Settings → Custom Domains → add your domain and create the DNS records Render shows (CNAME for `www`, ALIAS/ANAME or A record for the apex). Certificates are issued automatically once DNS resolves. Then set `ALLOWED_ORIGINS` to the final `https://` origin.
5. Verify: open the site, submit the form, and check the request reached the database (Render dashboard → `jwc-db` → Connect, or `curl -u admin https://your-domain/api/admin/requests`).

Notes: the backend and database must be in the same region (`frankfurt` in `render.yaml`; change it if you prefer another). Render's paid plans are required for private services and for a persistent database; check current plan names and prices in the dashboard, as `render.yaml` could not be validated against Render from the build environment. Rate limiting is in-memory, so keep `jwc-backend` at one instance.

## Production checklist
1. Server with Docker + Compose; DNS A/AAAA record for the domain.
2. Create `.env` with strong unique secrets; `PUBLIC_ORIGIN=https://your-domain`; set `HTTP_PORT` (e.g. `8080`) if a host proxy fronts the stack.
3. Terminate TLS in front of the `frontend` container (Caddy/Traefik/host Nginx with Let's Encrypt, or a cloud load balancer) and forward `X-Forwarded-*` headers; redirect HTTP→HTTPS and enable HSTS there.
4. Add real photography and a privacy notice / terms reviewed by the company's legal adviser.
5. Back up the `pgdata` volume (`pg_dump` on a schedule) and test a restore.
6. Keep the database unpublished (Compose does not expose it) and restrict SSH/firewall to 80/443.
7. Monitor `/actuator/health`; ship container logs somewhere durable. Rebuild images regularly for security updates.
8. If the API is ever scaled beyond one instance, move the rate limiter to a shared store.
