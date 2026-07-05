-- Run in Supabase SQL editor to find triggers/functions still referencing sender.
-- Error: record "new" has no field "sender" → a PL/pgSQL trigger on messages (or related)
-- still uses NEW.sender after the column was dropped.

-- 1) All triggers on messages
SELECT
  t.tgname AS trigger_name,
  CASE t.tgtype & 66
    WHEN 2 THEN 'BEFORE'
    WHEN 64 THEN 'INSTEAD OF'
    ELSE 'AFTER'
  END AS timing,
  CASE
    WHEN t.tgtype & 4 = 4 THEN 'INSERT'
    WHEN t.tgtype & 8 = 8 THEN 'DELETE'
    WHEN t.tgtype & 16 = 16 THEN 'UPDATE'
    ELSE 'MULTIPLE'
  END AS event,
  p.proname AS function_name,
  pg_get_triggerdef(t.oid, true) AS trigger_definition
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_proc p ON p.oid = t.tgfoid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname = 'messages'
  AND NOT t.tgisinternal
ORDER BY t.tgname;

-- 2) Functions whose source references NEW.sender (likely culprit)
SELECT
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS arguments,
  p.prosrc AS function_source
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND (
    p.prosrc ILIKE '%NEW.sender%'
    OR p.prosrc ILIKE '%new.sender%'
  )
ORDER BY p.proname;

-- 3) Triggers on messages whose function body mentions sender anywhere
SELECT
  t.tgname AS trigger_name,
  p.proname AS function_name,
  p.prosrc AS function_source
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_proc p ON p.oid = t.tgfoid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname = 'messages'
  AND NOT t.tgisinternal
  AND p.prosrc ILIKE '%sender%'
ORDER BY t.tgname;

-- 4) Also check conversations triggers (sometimes message send bumps conversation via shared function)
SELECT
  t.tgname AS trigger_name,
  c.relname AS table_name,
  p.proname AS function_name,
  p.prosrc AS function_source
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_proc p ON p.oid = t.tgfoid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('messages', 'conversations')
  AND NOT t.tgisinternal
  AND p.prosrc ILIKE '%sender%'
ORDER BY c.relname, t.tgname;
