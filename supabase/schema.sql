-- ========================================================
-- MaskedMatch Production Database Schema (PostgreSQL)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Candidate Profiles (Anonymized / Skills First)
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_code TEXT UNIQUE NOT NULL, -- e.g. "Candidate #8F3A"
  is_verified BOOLEAN DEFAULT false,
  verification_method TEXT DEFAULT 'thaid',
  assurance_level TEXT DEFAULT 'IAL2.3',
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  avatar_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Identity Vault (Restricted PII Isolated Data Plane)
CREATE TABLE IF NOT EXISTS identity_vault (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  institution TEXT,
  exact_employer TEXT,
  raw_resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Queue Tickets (Server-Authoritative Realtime Queue)
CREATE TABLE IF NOT EXISTS queue_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id TEXT NOT NULL,
  booth_id TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  candidate_code TEXT NOT NULL,
  position INT NOT NULL DEFAULT 1,
  estimated_wait_seconds INT NOT NULL DEFAULT 300,
  state TEXT NOT NULL DEFAULT 'QUEUED', -- QUEUED, READY_CHECK, ACCEPTED, CONNECTING, IN_SESSION, COMPLETED, EXPIRED
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  ready_check_expires_at TIMESTAMPTZ,
  snooze_count INT DEFAULT 0,
  entity_version INT DEFAULT 1
);

-- 4. Decision Cases (Double-Blind Decisions & Consented Reveal)
CREATE TABLE IF NOT EXISTS decision_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  job_id TEXT NOT NULL,
  booth_id TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  candidate_code TEXT NOT NULL,
  candidate_decision TEXT, -- INTERESTED | PASS (Encrypted at rest)
  recruiter_decision TEXT, -- INTERESTED | PASS
  state TEXT NOT NULL DEFAULT 'AWAITING_DECISIONS', -- AWAITING_DECISIONS, ONE_DECISION_SUBMITTED, MUTUAL_MATCH, NO_MATCH, REVEALED
  submitted_at_candidate TIMESTAMPTZ,
  submitted_at_recruiter TIMESTAMPTZ,
  revealed_fields JSONB DEFAULT '[]'::jsonb,
  recruiter_contact_grant JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Event Controls & Live Broadcasts
CREATE TABLE IF NOT EXISTS event_controls (
  id TEXT PRIMARY KEY DEFAULT 'main-event',
  name_th TEXT NOT NULL DEFAULT 'Neon Career City Virtual Job Fair 2026',
  is_paused BOOLEAN DEFAULT false,
  pause_reason TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_broadcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  level TEXT DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Realtime Publications for Realtime Sync
ALTER PUBLICATION supabase_realtime ADD TABLE queue_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE decision_cases;
ALTER PUBLICATION supabase_realtime ADD TABLE event_controls;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_broadcasts;
