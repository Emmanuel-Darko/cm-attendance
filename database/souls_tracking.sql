-- Chairman's 800,000 Souls Project Database Schema
-- Dedicated schema for tracking progress toward the church-wide 800,000 souls goal & district monthly target of 75.

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

-- Teams competing/participating in the souls project
CREATE TABLE IF NOT EXISTS soul_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL UNIQUE,
  color_tag VARCHAR(30) DEFAULT 'amber', -- e.g. 'amber', 'teal', 'indigo', 'rose', 'emerald', 'purple', 'sky', 'orange'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Individuals who win souls, each tied to one team
CREATE TABLE IF NOT EXISTS soul_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(150) NOT NULL,
  team_id UUID NOT NULL REFERENCES soul_teams(id) ON DELETE RESTRICT,
  phone VARCHAR(30),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_soul_winners_team ON soul_winners(team_id);

-- Status funnel for a won soul
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'soul_status') THEN
    CREATE TYPE soul_status AS ENUM (
      'new',            -- New Souls: just recorded
      'contacted',      -- Contacted: follow-up call/visit made
      'in_discipleship',-- In Discipleship: enrolled in a discipleship class
      'baptized',       -- Baptized: water baptized
      'integrated'      -- Integrated: fully integrated into local church/cell
    );
  ELSE
    -- Add baptized to existing enum if needed
    ALTER TYPE soul_status ADD VALUE IF NOT EXISTS 'baptized' AFTER 'in_discipleship';
  END IF;
END$$;

-- The souls themselves
CREATE TABLE IF NOT EXISTS souls (
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
CREATE INDEX IF NOT EXISTS idx_souls_won_by ON souls(won_by);
CREATE INDEX IF NOT EXISTS idx_souls_status ON souls(status);
CREATE INDEX IF NOT EXISTS idx_souls_date_won ON souls(date_won DESC);
CREATE INDEX IF NOT EXISTS idx_souls_created_at ON souls(created_at DESC);

-- Table holding overall project and district monthly targets
CREATE TABLE IF NOT EXISTS soul_targets (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  target_count INT NOT NULL DEFAULT 800000,
  monthly_target INT NOT NULL DEFAULT 75,
  project_title VARCHAR(200) NOT NULL DEFAULT 'Chairman''s 800,000 Souls Project'
);
INSERT INTO soul_targets (id, target_count, monthly_target, project_title)
VALUES (1, 800000, 75, 'Chairman''s 800,000 Souls Project')
ON CONFLICT (id) DO UPDATE SET monthly_target = 75;

-- Trigger to keep updated_at current on souls
CREATE OR REPLACE FUNCTION set_souls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_souls_updated_at ON souls;
CREATE TRIGGER trg_souls_updated_at
  BEFORE UPDATE ON souls
  FOR EACH ROW
  EXECUTE FUNCTION set_souls_updated_at();
