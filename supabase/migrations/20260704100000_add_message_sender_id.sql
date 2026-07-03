-- Required for message attribution (candidate vs employer bubbles).
-- Safe on empty table; backfill manually if rows already exist without sender_id.
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS sender_id uuid REFERENCES auth.users (id);

-- Enforce sender on new rows once column exists (table is empty in dev).
ALTER TABLE messages
  ALTER COLUMN sender_id SET NOT NULL;
