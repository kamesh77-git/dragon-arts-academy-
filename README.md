# Dragon Ryu Arts Academy website

Next.js 16 site for Dragon Ryu Arts Academy, Mannivakkam: public website + admin.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Postgres + Drizzle ORM · Auth.js v5 · Tailwind (admin only)

## Structure

```
app/(site)/            Public website (own root layout, ported site.css + pages.css)
  page.tsx             Home (same sections as the original static site + FAQ)
  [course]/page.tsx    12 keyword-targeted course pages, e.g. /karate-classes-in-mannivakkam
  courses/page.tsx     All courses
  blog/                Blog index, posts (/blog/[slug]) and RSS (/blog/rss.xml)
  actions.ts           Saves enquiry-form leads
app/admin/             Admin (own root layout with Tailwind)
  login/               Email/password (+ Google when configured)
  (dashboard)/         Overview, Enquiries, Attendance, Students, Blog editor (live 69-rule score), SEO, Team, My account
app/robots.ts, sitemap.ts, llms.txt/, llms-full.txt/   Crawl + AI-answer-engine files
content/blog/*.md      The 5 launch posts; `npm run blog:seed` imports them (posts then live in the DB)
lib/site.ts            Business facts (phones, address, stats) used everywhere
lib/courses.ts         Course content + SEO defaults
lib/pages.ts           Registry of SEO-managed pages
lib/seo/               69-rule SEO engine; audit.ts scores the live rendered HTML
db/schema.ts           users, page_seo (admin overrides), leads, posts, students, enrolments, attendance
lib/rbac.ts            Who can open what: admin = all, staff = enquiries, teacher = attendance/students for their arts
proxy.ts               Gates /admin
_starter-kit/          The LAMBLILY kit this was built from (not built, reference only)
```

## Local setup

```bash
npm install
cp .env.example .env.local        # then fill in DATABASE_URL and AUTH_SECRET
npm run db:push                   # create tables
npm run admin:create                # asks for email + password (hidden)
npm run blog:seed                 # import the 5 launch posts
npm run dev                       # http://localhost:3031
```

Images: put originals in `images/`, then `npm run images` writes resized WebP copies to `public/images/`.

SEO report from the terminal (server must be running):

```bash
npx tsx --conditions=react-server scripts/seo-report.ts http://localhost:3031 all
```

## Deploying

Needs a Postgres database (Neon recommended) and these env vars: `DATABASE_URL`, `AUTH_SECRET`,
`NEXT_PUBLIC_SITE_URL=https://www.dragonryuartsacademy.com`, optionally `AUTH_GOOGLE_ID` /
`AUTH_GOOGLE_SECRET`, `ADMIN_EMAILS`, and `GOOGLE_PLACES_API_KEY` (+ optional `GOOGLE_PLACE_ID`)
for live Google reviews. Without the key, the reviews section shows only a "Write a review" button. Run `npm run db:push` against the production database
once, then create the first admin with `npm run admin:create`.

## Roles

| Role | Access |
|---|---|
| Admin | Everything |
| Staff | Enquiries only |
| Teacher | Attendance (per student, or CSV upload) and read-only student pages, for the arts ticked on their Team entry |

## Not built yet (planned)

Fee payments, student/parent login, educator salary and payroll.
