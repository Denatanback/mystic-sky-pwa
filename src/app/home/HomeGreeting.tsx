"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";

export function HomeGreeting() {
  const [firstName, setFirstName] = useState<string>("");
  const { t } = useLang();

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const name =
        profile?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "";

      if (!cancelled && name) {
        setFirstName(name.trim().split(/\s+/)[0]);
      }
    }

    loadProfile();
    return () => { cancelled = true; };
  }, []);

  if (!firstName) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12
    ? t.home.greetingMorning || "Good morning"
    : hour < 18
    ? t.home.greetingDay || "Good afternoon"
    : t.home.greetingEvening || "Good evening";

  return (
    <div style={{ marginBottom: 4 }}>
      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>
        {greeting}, <span style={{ color: "var(--gold-2)", fontWeight: 600 }}>{firstName}</span>
      </p>
    </div>
  );
}
