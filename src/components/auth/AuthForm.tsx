"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrnateButton } from "@/components/ui/OrnateButton";
import { register as registerUser, signIn } from "@/lib/auth/authAdapter";

/* ─── Shared ─────────────────────────────────────────────── */

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p style={{
      fontSize: 12,
      color: "#d4744a",
      marginTop: 5,
      paddingLeft: 2,
      fontFamily: "var(--font-ui)",
      lineHeight: 1.3,
    }}>
      {msg}
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 10,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "rgba(185,143,79,0.7)",
      marginBottom: 5,
      fontFamily: "var(--font-ui)",
    }}>
      {children}
    </p>
  );
}

/* ─── Login form ─────────────────────────────────────────── */

type LoginErrors = { email?: string; password?: string };

export function LoginForm() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [errors,   setErrors]   = useState<LoginErrors>({});
  const [authError, setAuthError] = useState("");
  const [loading,  setLoading]  = useState(false);

  const clearErr = (k: keyof LoginErrors) =>
    setErrors((p) => ({ ...p, [k]: undefined }));

  const validate = (): LoginErrors => {
    const e: LoginErrors = {};
    if (!email.trim()) e.email = "Enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Enter your password";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setAuthError("");
    const result = await signIn({ email, password });
    setLoading(false);
    if (result.error) {
      setAuthError(result.error);
      return;
    }
    router.push("/today");
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <input
          className="parchment-input"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearErr("email"); }}
        />
        <FieldError msg={errors.email} />
      </div>

      <div>
        <input
          className="parchment-input"
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); clearErr("password"); }}
        />
        <FieldError msg={errors.password} />
      </div>

      <div style={{ marginTop: 4 }}>
        <OrnateButton type="submit">{loading ? "Signing in..." : "Sign in"}</OrnateButton>
      </div>
      <FieldError msg={authError} />

      <p style={{ textAlign: "center", fontSize: 13, color: "rgba(231,213,181,0.6)", marginTop: 4 }}>
        No profile yet?{" "}
        <Link href="/register" style={{ color: "var(--gold)" }}>Create your sky</Link>
      </p>
    </form>
  );
}

/* ─── Register form ──────────────────────────────────────── */

type RegErrors = {
  name?: string;
  email?: string;
  password?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [name,             setName]             = useState("");
  const [email,            setEmail]            = useState("");
  const [password,         setPassword]         = useState("");
  const [birthDate,        setBirthDate]        = useState("");
  const [birthTime,        setBirthTime]        = useState("");
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(false);
  const [birthPlace,       setBirthPlace]       = useState("");
  const [errors,           setErrors]           = useState<RegErrors>({});
  const [authError,        setAuthError]        = useState("");
  const [loading,          setLoading]          = useState(false);

  const clearErr = (k: keyof RegErrors) =>
    setErrors((p) => ({ ...p, [k]: undefined }));

  const validate = (): RegErrors => {
    const e: RegErrors = {};
    if (!name.trim())      e.name = "Enter your name";
    if (!email.trim())     e.email = "Enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password)         e.password = "Enter your password";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    if (!birthDate)        e.birthDate = "Add your birth date";
    if (!birthTimeUnknown && !birthTime) e.birthTime = "Add your birth time or mark it unknown";
    if (!birthPlace.trim()) e.birthPlace = "Add your birth place";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setAuthError("");
    const result = await registerUser({
      name,
      email,
      password,
      birthDate,
      birthTime,
      birthTimeUnknown,
      birthPlace,
    });
    setLoading(false);
    if (result.error) {
      setAuthError(result.error);
      return;
    }
    router.push("/today");
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* Name */}
      <div>
        <input
          className="parchment-input"
          placeholder="Name"
          autoComplete="name"
          value={name}
          onChange={(e) => { setName(e.target.value); clearErr("name"); }}
        />
        <FieldError msg={errors.name} />
      </div>

      {/* Email */}
      <div>
        <input
          className="parchment-input"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearErr("email"); }}
        />
        <FieldError msg={errors.email} />
      </div>

      {/* Password */}
      <div>
        <input
          className="parchment-input"
          placeholder="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); clearErr("password"); }}
        />
        <FieldError msg={errors.password} />
      </div>

      {/* Birth date */}
      <div>
        <FieldLabel>Birth date</FieldLabel>
        <input
          className="parchment-input"
          type="date"
          value={birthDate}
          onChange={(e) => { setBirthDate(e.target.value); clearErr("birthDate"); }}
        />
        <FieldError msg={errors.birthDate} />
      </div>

      {/* Birth time */}
      <div>
        <FieldLabel>Birth time</FieldLabel>
        <input
          className="parchment-input"
          type="time"
          value={birthTime}
          disabled={birthTimeUnknown}
          onChange={(e) => { setBirthTime(e.target.value); clearErr("birthTime"); }}
          style={{ opacity: birthTimeUnknown ? 0.4 : 1 }}
        />
        <FieldError msg={errors.birthTime} />
      </div>

      {/* Time unknown checkbox */}
      <label style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 13,
        color: "rgba(231,213,181,0.72)",
        cursor: "pointer",
        padding: "2px 0",
        marginTop: -2,
      }}>
        <input
          type="checkbox"
          checked={birthTimeUnknown}
          onChange={(e) => {
            setBirthTimeUnknown(e.target.checked);
            if (e.target.checked) { setBirthTime(""); clearErr("birthTime"); }
          }}
          style={{ width: 16, height: 16, accentColor: "var(--gold)", cursor: "pointer", flexShrink: 0 }}
        />
        I do not know the exact time
      </label>

      {/* Birth place */}
      <div>
        <input
          className="parchment-input"
          placeholder="Birth place"
          autoComplete="address-level2"
          value={birthPlace}
          onChange={(e) => { setBirthPlace(e.target.value); clearErr("birthPlace"); }}
        />
        <FieldError msg={errors.birthPlace} />
      </div>

      <div style={{ marginTop: 6 }}>
        <OrnateButton type="submit">{loading ? "Creating your sky..." : "Create your sky"}</OrnateButton>
      </div>
      <FieldError msg={authError} />

      <p style={{ textAlign: "center", fontSize: 13, color: "rgba(231,213,181,0.6)", marginTop: 4 }}>
        Already have a profile?{" "}
        <Link href="/login" style={{ color: "var(--gold)" }}>Sign in</Link>
      </p>
    </form>
  );
}
