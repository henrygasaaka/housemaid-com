-- Run in Supabase SQL Editor.
-- Confirmed existing enum values: own_visa, visit_visa
-- Wizard also needs the three values below.

ALTER TYPE public.visa_status ADD VALUE IF NOT EXISTS 'cancelled_visa';
ALTER TYPE public.visa_status ADD VALUE IF NOT EXISTS 'sponsored_visa';
ALTER TYPE public.visa_status ADD VALUE IF NOT EXISTS 'looking_for_sponsorship';
