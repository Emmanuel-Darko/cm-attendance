# Feature Spec: Chairman's 800,000 Souls Project

**Status:** Ready for implementation
**Type:** New feature module (mirrors existing `adult_visitors` / kids check-in patterns)
**Stack:** Nuxt 3, PostgreSQL (`pg` pool — swap for the project's shared DB client), Tailwind CSS, TypeScript

---

## 1. Overview

A dedicated page and supporting API for tracking progress toward a church-wide evangelism goal: **800,000 souls won**. Teams and individuals within those teams are credited with each soul they win. The feature has two halves:

1. **Dashboard** — overall progress toward 800,000, team/individual leaderboards, status breakdown.
2. **Intake interface** — a form to record a newly won soul and assign it to the individual (and their team) who won them.

A lightweight **Teams & Winners directory** is required as a dependency: you can't assign a soul to an individual with a team tag unless individuals and teams already exist as records.

---

## 2. Assumptions (flag/confirm before or during implementation)

- [ ] Target of **800,000** is a fixed constant for now (not admin-editable in this pass). Recommend storing it in a `soul_targets` table of one row so it *can* be edited later without a migration.
- [ ] "Team" is a flat, non-nested grouping (no sub-teams).
- [ ] An individual belongs to exactly **one** team.
- [ ] Anyone with access to this page can log a soul — no per-role permission gating in this pass (flag if the app has an existing roles/auth system to hook into).
- [ ] Palette: reusing the app's existing Tailwind setup; suggested accent is **gold/amber on deep blue** (a "chairman's project" feel), but defaulting to the same **deep teal + warm amber** palette already established for adult visitor tracking is fine if consistency matters more than a distinct identity. Pick one and note the choice in the PR.
- [ ] Soul records store a name and optional light contact info — this is a discipleship/follow-up funnel, not a full CRM. Keep fields minimal per "simple dashboard" scope.

---

## 3. Data Model (PostgreSQL migration)

```sql
-- Teams competing/participating in the souls project
CREATE TABLE soul_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL UNIQUE,
  color_tag VARCHAR(30), -- e.g. 'amber', 'teal' — used for badges/chips in UI
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Individuals who win souls, each tied to one team
CREATE TABLE soul_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(150) NOT NULL,
  team_id UUID NOT NULL REFERENCES soul_teams(id) ON DELETE RESTRICT,
  phone VARCHAR(30),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_soul_winners_team ON soul_winners(team_id);

-- Status funnel for a won soul
CREATE TYPE soul_status AS ENUM (
  'new',            -- just recorded
  'contacted',      -- follow-up call/visit made
  'in_discipleship',-- enrolled in a follow-up/discipleship class
  'integrated'       -- fully integrated into a local church/cell
);

-- The souls themselves
CREATE TABLE souls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  location VARCHAR(150),          -- optional: area/community where won
  date_won DATE NOT NULL DEFAULT CURRENT_DATE,
  status soul_status NOT NULL DEFAULT 'new',
  won_by UUID NOT NULL REFERENCES soul_winners(id) ON DELETE RESTRICT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_souls_won_by ON souls(won_by);
CREATE INDEX idx_souls_status ON souls(status);
CREATE INDEX idx_souls_date_won ON souls(date_won);

-- Single-row table holding the overall project target, editable later without a migration
CREATE TABLE soul_targets (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  target_count INT NOT NULL DEFAULT 800000,
  project_title VARCHAR(200) NOT NULL DEFAULT 'Chairman''s 800,000 Souls Project'
);
INSERT INTO soul_targets (id) VALUES (1) ON CONFLICT DO NOTHING;
```

`team_id` on `soul_winners` is what makes "team tag" available everywhere a soul is displayed — join `souls → soul_winners → soul_teams` to get the team name/color for a given soul without duplicating it on the `souls` row.

---

## 4. Server API Routes (Nuxt server routes, TypeScript)

Mirror the four-handler pattern used for `adult_visitors`.

### Teams
- `GET /api/soul-teams` — list all teams, each with a computed `soul_count` (count of souls won by members of that team).
- `POST /api/soul-teams` — create a team `{ name, color_tag }`.
- `PATCH /api/soul-teams/[id]` — update a team.
- `DELETE /api/soul-teams/[id]` — delete a team (block if winners are still assigned to it — return 409).

### Winners (individuals)
- `GET /api/soul-winners?team_id=` — list winners, optionally filtered by team, each with a computed `soul_count`.
- `POST /api/soul-winners` — create a winner `{ full_name, team_id, phone }`.
- `PATCH /api/soul-winners/[id]` — update.
- `DELETE /api/soul-winners/[id]` — delete (block if souls reference them — return 409).

### Souls
- `GET /api/souls` — list souls with filtering/search, supporting query params:
  - `search` (name/location)
  - `team_id`
  - `won_by`
  - `status`
  - `date_from`, `date_to`
  - Returns each soul joined with winner name and team name/color_tag.
- `POST /api/souls` — create a soul `{ full_name, phone, location, date_won, won_by, notes, status? }`. `status` defaults to `'new'`.
- `PATCH /api/souls/[id]` — update any field, primarily used for inline status changes.
- `DELETE /api/souls/[id]` — delete a soul record.

### Dashboard summary
- `GET /api/souls/summary` — single endpoint returning everything the dashboard needs in one call:
  ```json
  {
    "target": 800000,
    "project_title": "Chairman's 800,000 Souls Project",
    "total_souls": 0,
    "status_breakdown": { "new": 0, "contacted": 0, "in_discipleship": 0, "integrated": 0 },
    "team_leaderboard": [ { "team_id": "", "team_name": "", "color_tag": "", "count": 0 } ],
    "top_winners": [ { "winner_id": "", "full_name": "", "team_name": "", "count": 0 } ],
    "recent_souls": [ { "id": "", "full_name": "", "team_name": "", "won_by_name": "", "date_won": "", "status": "" } ]
  }
  ```
  `team_leaderboard` sorted by `count` desc; `top_winners` limited to top 10; `recent_souls` limited to the latest 10 by `created_at`.

---

## 5. Composable: `useSoulsTracking`

TypeScript composable using `useState` for reactive shared state, following the `useAdultVisitors` pattern:

- State: `souls`, `teams`, `winners`, `summary`, `filters`, `loading`, `error`.
- Methods:
  - `fetchSummary()`
  - `fetchSouls(filters?)`
  - `addSoul(payload)`
  - `updateSoulStatus(id, status)`
  - `deleteSoul(id)`
  - `fetchTeams()`, `addTeam(payload)`
  - `fetchWinners(teamId?)`, `addWinner(payload)`
- Derived getter: `progressPercent` = `(summary.total_souls / summary.target) * 100`, clamped to 100 for the progress bar fill but the raw percentage displayed as text.

---

## 6. Pages / UI

### `/souls` — Dashboard (primary page)

1. **Header:** "Chairman's 800,000 Souls Project" as page title.
2. **Progress hero:** large progress bar/gauge showing `total_souls / 800,000` with percentage, styled prominently (this is the emotional centerpiece of the page).
3. **Status funnel cards:** four small stat cards — New, Contacted, In Discipleship, Integrated — with counts.
4. **Team leaderboard:** ranked list/table of teams by souls won, each row showing team name (with color tag as a chip), soul count, and a mini progress bar relative to the top team.
5. **Top individual winners:** ranked list of top 10 individuals, showing name, team tag badge, and count.
6. **Recent souls table:** latest entries with name, team badge, winner name, date won, status (inline-editable dropdown, matching the adult-visitor inline status editing pattern).
7. **Filters bar** above the recent souls table: search box, team dropdown, winner dropdown (dependent on team), status dropdown, date range.
8. **"Add a Soul" button** — opens the intake form (modal or dedicated section).

### Add-Soul Interface (modal or `/souls/new`)

Form fields:
- Full name (required)
- Phone (optional)
- Location (optional)
- Date won (defaults to today)
- **Team** (dropdown, required) → selecting a team filters the winner dropdown
- **Winner/individual** (dropdown, required, filtered by selected team) — include an inline "+ add new person to this team" option that opens a tiny sub-form (`full_name`, `phone`) and calls `addWinner`
- Status (dropdown, defaults to "New")
- Notes (textarea, optional)

On submit: `addSoul()`, refresh `summary` and `souls` list, show a success toast, reset form.

### `/souls/teams` (simple admin page, optional but recommended)

Basic CRUD table for teams and, nested/expandable per team, their list of individuals. Needed so the dropdowns on the intake form aren't empty on first use. Can be a simple two-panel layout: teams list on the left, selected team's members on the right, each with inline add/edit/delete.

---

## 7. File structure to deliver

```
server/api/soul-teams/index.get.ts
server/api/soul-teams/index.post.ts
server/api/soul-teams/[id].patch.ts
server/api/soul-teams/[id].delete.ts

server/api/soul-winners/index.get.ts
server/api/soul-winners/index.post.ts
server/api/soul-winners/[id].patch.ts
server/api/soul-winners/[id].delete.ts

server/api/souls/index.get.ts
server/api/souls/index.post.ts
server/api/souls/[id].patch.ts
server/api/souls/[id].delete.ts
server/api/souls/summary.get.ts

composables/useSoulsTracking.ts

pages/souls/index.vue      -- dashboard + add-soul modal
pages/souls/teams.vue      -- teams & winners admin

db/migrations/xxxx_create_souls_tracking.sql
```

---

## 8. Out of scope (future iterations)

- Editable target count via UI (schema supports it; no admin UI in this pass).
- Role-based permissions (who can log a soul vs. who can only view).
- Photo/avatar per soul or winner.
- Export (CSV/PDF) of the souls list.
- Notifications/milestone alerts (e.g. "10,000 souls reached").
