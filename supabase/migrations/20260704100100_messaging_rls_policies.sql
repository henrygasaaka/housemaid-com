-- Run in Supabase SQL editor if messaging RLS is not already configured.
-- Participants may only read/write conversations they belong to.
-- Messages must be sent with sender_id = auth.uid().

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participants can view conversations" ON conversations;
CREATE POLICY "Participants can view conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = candidate_id OR auth.uid() = employer_id);

DROP POLICY IF EXISTS "Participants can create conversations" ON conversations;
CREATE POLICY "Participants can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = candidate_id OR auth.uid() = employer_id);

DROP POLICY IF EXISTS "Participants can update conversations" ON conversations;
CREATE POLICY "Participants can update conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = candidate_id OR auth.uid() = employer_id)
  WITH CHECK (auth.uid() = candidate_id OR auth.uid() = employer_id);

DROP POLICY IF EXISTS "Participants can view messages" ON messages;
CREATE POLICY "Participants can view messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.candidate_id = auth.uid() OR c.employer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Participants can send messages" ON messages;
CREATE POLICY "Participants can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
        AND (c.candidate_id = auth.uid() OR c.employer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Recipients can mark messages read" ON messages;
CREATE POLICY "Recipients can mark messages read"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (
          (c.candidate_id = auth.uid() AND messages.sender_id = c.employer_id)
          OR (c.employer_id = auth.uid() AND messages.sender_id = c.candidate_id)
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (
          (c.candidate_id = auth.uid() AND messages.sender_id = c.employer_id)
          OR (c.employer_id = auth.uid() AND messages.sender_id = c.candidate_id)
        )
    )
  );

-- Allow conversation participants to read employer display names in the inbox.
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view employers" ON employers;
CREATE POLICY "Authenticated users can view employers"
  ON employers FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users manage own employer profile" ON employers;
CREATE POLICY "Users manage own employer profile"
  ON employers FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own employer profile" ON employers;
CREATE POLICY "Users update own employer profile"
  ON employers FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
