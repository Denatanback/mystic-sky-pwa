"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrnateButton } from "@/components/ui/OrnateButton";
import { getMockUser, saveMockUser, setMockAuthenticated } from "@/lib/mockAuth";

/* ─── Shared ─────────────────────────────────────────────── */

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p style={{
      fontSize: 12,
      color: "#d4744a",
      marginTop: 5,
      paddingLeft: 2,
      fontFamily: "var(--font-serif)",
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
      fontFamily: "var(--font-serif)",
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
  const [loading,  setLoading]  = useState(false);

  const clearErr = (k: keyof LoginErrors) =>
    setErrors((p) => ({ ...p, [k]: undefined }));

  const validate = (): LoginErrors => {
    const e: LoginErrors = {};
    if (!email.trim()) e.email = "Введи email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Неверный формат email";
    if (!password) e.password = "Введи пароль";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setMockAuthenticated();
    if (!getMockUser()) {
      saveMockUser({
        name: "Путник",
        email: email.trim(),
        gender: "",
        birthDate: "",
        birthTime: "",
        birthTimeUnknown: false,
        birthPlace: "",
        createdAt: new Date().toISOString(),
      });
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
          placeholder="Пароль"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); clearErr("password"); }}
        />
        <FieldError msg={errors.password} />
      </div>

      <div style={{ marginTop: 4 }}>
        <OrnateButton type="submit">{loading ? "Входим..." : "Войти"}</OrnateButton>
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "rgba(231,213,181,0.6)", marginTop: 4 }}>
        Нет профиля?{" "}
        <Link href="/register" style={{ color: "var(--gold)" }}>Создать небо</Link>
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
  const [loading,          setLoading]          = useState(false);

  const clearErr = (k: keyof RegErrors) =>
    setErrors((p) => ({ ...p, [k]: undefined }));

  const validate = (): RegErrors => {
    const e: RegErrors = {};
    if (!name.trim())      e.name = "Введи имя";
    if (!email.trim())     e.email = "Введи email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Неверный формат email";
    if (!password)         e.password = "Введи пароль";
    else if (password.length < 6) e.password = "Минимум 6 символов";
    if (!birthDate)        e.birthDate = "Укажи дату рождения";
    if (!birthTimeUnknown && !birthTime) e.birthTime = "Укажи время или отметь «не знаю»";
    if (!birthPlace.trim()) e.birthPlace = "Укажи место рождения";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    saveMockUser({
      name: name.trim(),
      email: email.trim(),
      gender: "",
      birthDate,
      birthTime: birthTimeUnknown ? "" : birthTime,
      birthTimeUnknown,
      birthPlace: birthPlace.trim(),
      createdAt: new Date().toISOString(),
    });
    setMockAuthenticated();
    router.push("/today");
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* Name */}
      <div>
        <input
          className="parchment-input"
          placeholder="Имя"
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
          placeholder="Пароль"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); clearErr("password"); }}
        />
        <FieldError msg={errors.password} />
      </div>

      {/* Birth date */}
      <div>
        <FieldLabel>Дата рождения</FieldLabel>
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
        <FieldLabel>Время рождения</FieldLabel>
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
        Я не знаю точное время
      </label>

      {/* Birth place */}
      <div>
        <input
          className="parchment-input"
          placeholder="Место рождения"
          autoComplete="address-level2"
          value={birthPlace}
          onChange={(e) => { setBirthPlace(e.target.value); clearErr("birthPlace"); }}
        />
        <FieldError msg={errors.birthPlace} />
      </div>

      <div style={{ marginTop: 6 }}>
        <OrnateButton type="submit">{loading ? "Создаем небо..." : "Создать небо"}</OrnateButton>
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "rgba(231,213,181,0.6)", marginTop: 4 }}>
        Уже есть профиль?{" "}
        <Link href="/login" style={{ color: "var(--gold)" }}>Войти</Link>
      </p>
    </form>
  );
}
