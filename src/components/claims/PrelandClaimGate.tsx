"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { StarField } from "@/components/app-shell/StarField";
import {
  applyClaimToProgress,
  clearClaim,
  detectClaim,
  validateClaim,
  type ValidPrelandClaim,
} from "@/lib/claims/claimFlow";

const PAST_LIFE_RESULTS: Record<string, {
  title: string;
  desc: string;
  gift: string;
  mirror: string;
  color: string;
}> = {
  healer: { title: "Healer", desc: "Your answers point to a past-life role centered on repair, comfort, and restoring what was wounded.", gift: "You may carry a calming presence, emotional repair, and deep compassion into this life.", mirror: "This role may reflect a recurring pattern of helping others without forgetting your own needs.", color: "#7ab04a" },
  warrior: { title: "Warrior", desc: "Your answers point to a past-life role shaped by courage, protection, and decisive action under pressure.", gift: "You may carry courage, protection, and endurance into this life.", mirror: "This role may reflect a pattern of learning when to fight, when to soften, and when to trust peace.", color: "#e05050" },
  priest: { title: "Priest / Priestess", desc: "Your answers point to a past-life role devoted to ritual, intuition, and carrying meaning for others.", gift: "You may carry intuition, ritual sensitivity, and spiritual devotion into this life.", mirror: "This role may reflect a recurring pattern of trusting inner knowing without isolating yourself from ordinary life.", color: "#9070d8" },
  priestess: { title: "Priest / Priestess", desc: "Your answers point to a past-life role devoted to ritual, intuition, and carrying meaning for others.", gift: "You may carry intuition, ritual sensitivity, and spiritual devotion into this life.", mirror: "This role may reflect a recurring pattern of trusting inner knowing without isolating yourself from ordinary life.", color: "#9070d8" },
  scientist: { title: "Scientist", desc: "Your answers point to a past-life role that studied patterns, solved problems, and searched for hidden laws.", gift: "You may carry analysis, discovery, and precision into this life.", mirror: "This role may reflect a pattern of balancing the mind's certainty with the soul's mystery.", color: "#7ab8d8" },
  artist: { title: "Artist", desc: "Your answers point to a past-life role that transformed emotion, beauty, and longing into visible form.", gift: "You may carry expression, beauty, and emotional truth into this life.", mirror: "This role may reflect a pattern of letting yourself be seen instead of hiding your sensitivity.", color: "#e06090" },
  explorer: { title: "Explorer", desc: "Your answers point to a past-life role drawn toward movement, foreign horizons, and unknown paths.", gift: "You may carry freedom, curiosity, and adaptability into this life.", mirror: "This role may reflect a recurring pattern of seeking freedom while learning where you truly belong.", color: "#d8a85f" },
  teacher: { title: "Teacher", desc: "Your answers point to a past-life role that carried knowledge, guided others, and translated experience into wisdom.", gift: "You may carry guidance, patience, and wisdom into this life.", mirror: "This role may reflect a pattern of sharing wisdom without needing to carry everyone's path for them.", color: "#c0a0d8" },
  ruler: { title: "Ruler", desc: "Your answers point to a past-life role of leadership, responsibility, and decisions that affected many lives.", gift: "You may carry leadership, responsibility, and command into this life.", mirror: "This role may reflect a recurring pattern of using power with humility instead of control.", color: "#d8a85f" },
};

const SOULMATE_RESULTS: Record<string, {
  title: string;
  desc: string;
  gift: string;
  mirror: string;
  color: string;
}> = {
  protector: { title: "Protector", desc: "You are most likely to attract someone steady, loyal, and emotionally protective.", gift: "They may be drawn to your tenderness, loyalty, and the way you make love feel emotionally real.", mirror: "The connection may ask you not to confuse protection with control, or safety with predictability.", color: "#7ab04a" },
  adventurer: { title: "Adventurer", desc: "You are most likely to attract someone free-spirited, bold, and drawn toward life.", gift: "They may be drawn to your curiosity, spark, and the parts of you that still want life to surprise you.", mirror: "The connection may ask you to keep freedom and commitment in the same room.", color: "#d8a85f" },
  mystic: { title: "Mystic", desc: "You are most likely to attract someone intuitive, deep, and hard to fully explain.", gift: "They may be drawn to your intuition, emotional depth, and the quiet mystery you do not explain to everyone.", mirror: "The connection may ask you to ground the magic instead of disappearing into fantasy or silence.", color: "#9070d8" },
  creator: { title: "Creator", desc: "You are most likely to attract someone expressive, imaginative, and creatively alive.", gift: "They may be drawn to your expressiveness, imagination, and the way your feelings become beauty.", mirror: "The connection may ask you to be seen clearly, not only admired or idealized.", color: "#e06090" },
  intellectual: { title: "Intellectual", desc: "You are most likely to attract someone mentally electric, curious, and conversationally intimate.", gift: "They may be drawn to your mind, your questions, and the way conversation can become intimacy for you.", mirror: "The connection may ask you to let the heart speak before the mind explains everything away.", color: "#7ab8d8" },
  healer: { title: "Healer", desc: "You are most likely to attract someone gentle, restorative, and emotionally compassionate.", gift: "They may be drawn to your softness, empathy, and the part of you that understands pain without judging it.", mirror: "The connection may ask you to receive care without turning love into a rescue mission.", color: "#c0a0d8" },
};

function getResultData(claim: ValidPrelandClaim) {
  return claim.claimType === "past_life_role"
    ? PAST_LIFE_RESULTS[claim.resultId]
    : SOULMATE_RESULTS[claim.resultId];
}

function ClaimResultScreen({ claim }: { claim: ValidPrelandClaim }) {
  const router = useRouter();
  const result = getResultData(claim);

  const handleContinue = () => {
    clearClaim();
    router.replace(claim.afterContinueHref);
  };

  if (!result) return null;

  return (
    <main className="app no-nav" style={{ minHeight: "100dvh", position: "relative", overflow: "hidden" }}>
      <StarField />
      <div className="content" style={{ position: "relative", zIndex: 2, paddingTop: 34, paddingBottom: 34 }}>
        <div style={{ border: "1px solid rgba(216,168,95,.22)", borderRadius: 24, padding: "22px 18px", background: "rgba(12,8,28,.72)", boxShadow: "0 18px 48px rgba(0,0,0,.35)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>
              Your paid result is ready
            </p>
            <div style={{ width: 112, height: 112, margin: "0 auto 14px", borderRadius: "50%", background: `radial-gradient(circle, ${result.color}33, rgba(14,10,32,.95))`, border: `2px solid ${result.color}66`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 34px ${result.color}44` }}>
              <span style={{ fontSize: 50 }}>{claim.claimType === "past_life_role" ? "*" : "\u2665"}</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 34, lineHeight: 1.05, color: "var(--text)", marginBottom: 6 }}>{result.title}</h1>
            <p style={{ fontSize: 13, color: "var(--gold-2)" }}>{claim.resultTitle}</p>
          </div>

          {[
            { label: "RESULT", body: result.desc },
            { label: claim.claimType === "past_life_role" ? "GIFT CARRIED FORWARD" : "WHAT DRAWS THEM TO YOU", body: result.gift },
            { label: "REFLECTION", body: result.mirror },
          ].map((item) => (
            <div key={item.label} style={{ border: `1px solid ${result.color}40`, borderRadius: 15, padding: "14px 16px", background: "rgba(14,10,32,.55)", marginBottom: 10 }}>
              <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 800, letterSpacing: ".09em", marginBottom: 6 }}>{item.label}</p>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.58 }}>{item.body}</p>
            </div>
          ))}

          <div style={{ border: "1px solid rgba(216,168,95,.18)", borderRadius: 15, padding: "13px 15px", background: "rgba(216,168,95,.06)", margin: "14px 0 18px" }}>
            <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55 }}>
              This result has been saved as your official Level 1 result. You will not need to retake this quiz in the app.
            </p>
          </div>

          <button onClick={handleContinue} style={{ width: "100%", height: 54, borderRadius: 999, background: "linear-gradient(135deg,#7030b0,#b03060)", color: "#fff", border: "none", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(110,30,130,.45)" }}>
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}

export function PrelandClaimGate({ children }: { children: ReactNode }) {
  const [claim, setClaim] = useState<ValidPrelandClaim | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const valid = validateClaim(detectClaim());
    if (!valid) {
      clearClaim();
      setChecked(true);
      return;
    }
    applyClaimToProgress(valid);
    setClaim(valid);
    setChecked(true);
  }, []);

  if (!checked) {
    return (
      <main className="app no-nav" style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24 }}>
        <StarField />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
          Preparing your result...
        </div>
      </main>
    );
  }

  if (claim) return <ClaimResultScreen claim={claim} />;

  return <>{children}</>;
}
