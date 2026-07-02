-- Media columns on candidates (profile photo + intro video).
-- candidate_documents remains for verification docs only: passport, visa, emirates_id.

ALTER TABLE candidates ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS video_storage_path text;

-- Optional: only needed if you want storage uploads with upsert: true.
-- Verified: upsert:false works with INSERT-only policy; upsert:true fails RLS.
--
-- CREATE POLICY candidate_photos_own_folder_update ON storage.objects
-- FOR UPDATE TO authenticated
-- USING (
--   bucket_id = 'candidate-photos'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- )
-- WITH CHECK (
--   bucket_id = 'candidate-photos'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- );
