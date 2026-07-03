import { createClient as createBrowserClient } from "@/lib/supabase/client";

/** Browser Supabase client for client components and hooks. */
export function createClient() {
  return createBrowserClient();
}