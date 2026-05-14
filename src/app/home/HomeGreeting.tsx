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

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ marginTop: 12 }}>
      <h1 style={{
        fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 30,
        lineHeight: 1.15, color: "var(--text)",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        {t.home.hello} {firstName || "…"}
        <span style={{ color: "var(--gold-2)", fontSize: 18, verticalAlign: "middle" }}>✦</span>
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
        {t.home.greetingLine2}
      </p>
    </div>
  );
}
