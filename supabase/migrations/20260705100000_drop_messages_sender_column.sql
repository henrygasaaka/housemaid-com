-- Drop legacy message_sender enum column; app uses sender_id (uuid) only.
-- Run in Supabase SQL editor if employer/candidate sends fail with:
--   null value in column "sender" of relation "messages"

ALTER TABLE messages DROP COLUMN IF EXISTS sender;

-- Orphan enum from original schema (safe once sender column is gone).
DROP TYPE IF EXISTS message_sender;
