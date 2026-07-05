"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { hydrateEmployerPaywallFromDb } from "@/lib/employer-session";
import { createClient } from "@/lib/supabase";

async function hydratePaywallForUser(user: User) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("employers")
    .select("free_messages_used, has_unlocked_premium")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[employer-auth] Failed to load paywall state:", error.message);
    return;
  }

  if (!data) return;

  hydrateEmployerPaywallFromDb(
    data.free_messages_used ?? 0,
    Boolean(data.has_unlocked_premium)
  );
}

export function useEmployerAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (cancelled) return;
      setUser(authUser);
      setLoading(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(session?.user ?? null);
        setLoading(false);
        return;
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
        setLoading(false);
      }
    });

    void load();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const authUser = user;
    let cancelled = false;

    async function hydrate() {
      await hydratePaywallForUser(authUser);
      if (cancelled) return;
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return {
    user,
    loading,
    isGuest: !user,
  };
}
