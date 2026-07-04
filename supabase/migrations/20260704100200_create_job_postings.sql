-- Employer job postings for the candidate Jobs screen (/candidate/jobs).
-- Run in Supabase SQL editor if job_postings does not exist yet.

CREATE TABLE IF NOT EXISTS job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  employer_id uuid NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  title text NOT NULL,
  emirate text,
  district text,
  salary_min numeric,
  salary_max numeric,
  salary_period text NOT NULL DEFAULT 'monthly'
    CHECK (salary_period IN ('monthly', 'hourly')),
  employment_type text
    CHECK (employment_type IN ('full_time', 'part_time')),
  work_arrangement text
    CHECK (work_arrangement IN ('live_in', 'live_out')),
  requirements text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'active', 'closed'))
);

CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  job_id uuid NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'interested'
    CHECK (status IN ('interested', 'withdrawn')),
  UNIQUE (job_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS job_postings_status_created_idx
  ON job_postings (status, created_at DESC);

CREATE INDEX IF NOT EXISTS job_applications_candidate_idx
  ON job_applications (candidate_id);

ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Candidates browse active postings; employers manage their own.
DROP POLICY IF EXISTS "Authenticated users can view active job postings" ON job_postings;
CREATE POLICY "Authenticated users can view active job postings"
  ON job_postings FOR SELECT
  TO authenticated
  USING (status = 'active' OR employer_id = auth.uid());

DROP POLICY IF EXISTS "Employers can create job postings" ON job_postings;
CREATE POLICY "Employers can create job postings"
  ON job_postings FOR INSERT
  WITH CHECK (employer_id = auth.uid());

DROP POLICY IF EXISTS "Employers can update own job postings" ON job_postings;
CREATE POLICY "Employers can update own job postings"
  ON job_postings FOR UPDATE
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

DROP POLICY IF EXISTS "Employers can delete own job postings" ON job_postings;
CREATE POLICY "Employers can delete own job postings"
  ON job_postings FOR DELETE
  USING (employer_id = auth.uid());

-- Candidates express interest; both parties can see relevant applications.
DROP POLICY IF EXISTS "Candidates can view own job applications" ON job_applications;
CREATE POLICY "Candidates can view own job applications"
  ON job_applications FOR SELECT
  USING (
    candidate_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM job_postings jp
      WHERE jp.id = job_applications.job_id
        AND jp.employer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Candidates can express interest" ON job_applications;
CREATE POLICY "Candidates can express interest"
  ON job_applications FOR INSERT
  WITH CHECK (candidate_id = auth.uid());

DROP POLICY IF EXISTS "Candidates can withdraw interest" ON job_applications;
CREATE POLICY "Candidates can withdraw interest"
  ON job_applications FOR UPDATE
  USING (candidate_id = auth.uid())
  WITH CHECK (candidate_id = auth.uid());
