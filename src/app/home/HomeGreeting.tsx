"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth/authAdapter";
import { useLang } from "@/lib/i18n";

export function HomeGreeting() {
  const [firstName, setFirstName] = useState<string>("");
  const { t } = useLang();

  useEffect(() => {
    let cancelled = false;
    void getCurrentUser().then((user) => {
      if (!cancelled && user?.name) {
        setFirstName(user.name.trim().split(/\s+/)[0]);
      }
    });
    return () => {
      cancelled = true;
    };
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
