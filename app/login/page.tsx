"use client";

import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/auth";

type Stage = "identifier" | "verify";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, requestCode, verifyCode } = useAuth();

  const [stage, setStage]           = useState<Stage>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [demoCode, setDemoCode]     = useState("");
  const [exists, setExists]         = useState(false);
  const [code, setCode]             = useState("");
  const [name, setName]             = useState("");
  const [error, setError]           = useState<string | null>(null);
  const [busy, setBusy]             = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  async function handleRequest(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await requestCode(identifier);
    setBusy(false);
    if (result.error) { setError(result.error); return; }
    setDemoCode(result.code);
    setExists(result.exists);
    setCode("");
    setName("");
    setStage("verify");
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    if (code.length !== 6) { setError("Enter all 6 digits."); return; }
    if (!exists && !name.trim()) { setError("Tell us your name to finish creating your account."); return; }
    setError(null);
    setBusy(true);
    const result = await verifyCode(identifier, code, name);
    setBusy(false);
    if (result.error) setError(result.error);
    else router.replace("/");
  }

  async function handleResend() {
    setError(null);
    const result = await requestCode(identifier);
    if (result.error) { setError(result.error); return; }
    setDemoCode(result.code);
    setCode("");
  }

  function backToIdentifier() {
    setStage("identifier");
    setError(null);
    setCode("");
    setDemoCode("");
  }

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      {stage === "identifier" ? (
        <IdentifierStage
          identifier={identifier}
          setIdentifier={setIdentifier}
          onSubmit={handleRequest}
          busy={busy}
          error={error}
        />
      ) : (
        <VerifyStage
          identifier={identifier}
          demoCode={demoCode}
          exists={exists}
          code={code}
          setCode={setCode}
          name={name}
          setName={setName}
          onSubmit={handleVerify}
          onBack={backToIdentifier}
          onResend={handleResend}
          busy={busy}
          error={error}
        />
      )}
    </div>
  );
}

/* ── Stage 1: identifier ──────────────────────────────── */

function IdentifierStage({
  identifier, setIdentifier, onSubmit, busy, error,
}: {
  identifier: string;
  setIdentifier: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  busy: boolean;
  error: string | null;
}) {
  return (
    <>
      {/* Branding */}
      <div className="flex flex-col items-center text-center px-8 pt-safe pb-10">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-5 shadow-md">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        <h1 className="text-[36px] font-bold tracking-tight text-foreground leading-none mb-2">
          WalkIn
        </h1>
        <p className="text-[16px] text-muted leading-snug max-w-65">
          Find what you need at local stores, right now.
        </p>

        <div className="flex items-center gap-3 mt-7">
          {[
            { label: "Search", icon: <SearchIcon /> },
            null,
            { label: "Find",   icon: <StoreIcon /> },
            null,
            { label: "Walk",   icon: <WalkIcon /> },
          ].map((step, i) =>
            step ? (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-primary">
                  {step.icon}
                </div>
                <span className="text-[11px] font-semibold text-muted">{step.label}</span>
              </div>
            ) : (
              <div key={i} className="pb-5 text-border">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            )
          )}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-5 pb-10">
        <h2 className="text-[20px] font-semibold text-foreground text-center mb-1.5">
          Sign in or create an account
        </h2>
        <p className="text-[14px] text-muted text-center mb-7">
          We&apos;ll send a 6-digit code to verify it&apos;s you.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-foreground">
              Email or phone
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or +30 690 000 0000"
              autoComplete="email"
              autoFocus
              required
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-[15px] text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"
            />
          </div>

          {error && <p className="text-[13px] text-red-500 -mt-1">{error}</p>}

          <button
            type="submit"
            disabled={busy || !identifier.trim()}
            className="w-full py-4 mt-1 rounded-2xl bg-primary text-white font-bold text-[16px] active:opacity-80 transition-opacity disabled:opacity-40"
          >
            {busy ? "Sending…" : "Send code"}
          </button>
        </form>

        <p className="text-[12px] text-muted text-center mt-6 leading-relaxed">
          By continuing you agree to our{" "}
          <span className="text-primary">Terms of Service</span> and{" "}
          <span className="text-primary">Privacy Policy</span>.
        </p>
      </div>
    </>
  );
}

/* ── Stage 2: verify ──────────────────────────────────── */

function VerifyStage({
  identifier, demoCode, exists, code, setCode, name, setName,
  onSubmit, onBack, onResend, busy, error,
}: {
  identifier: string;
  demoCode: string;
  exists: boolean;
  code: string;
  setCode: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  onBack: () => void;
  onResend: () => void;
  busy: boolean;
  error: string | null;
}) {
  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-safe pb-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[14px] font-medium text-muted active:opacity-60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <span className="text-[13px] font-semibold text-muted tracking-wider">WALKIN</span>
        <span className="w-12" />
      </div>

      {/* Heading */}
      <div className="px-8 pt-10 pb-7 text-center">
        <h1 className="text-[28px] font-bold tracking-tight text-foreground leading-tight mb-2">
          Enter the 6-digit code
        </h1>
        <p className="text-[14px] text-muted leading-snug">
          Sent to <span className="text-foreground font-medium">{identifier}</span>
        </p>
      </div>

      {/* Demo banner */}
      <div className="mx-5 mb-7">
        <button
          type="button"
          onClick={() => setCode(demoCode)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-left active:opacity-70 transition-opacity"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Demo mode
            </span>
            <span className="text-[13px] text-muted leading-snug">
              Tap to fill the code
            </span>
          </div>
          <span className="text-[20px] font-bold tracking-[0.3em] text-foreground tabular-nums">
            {demoCode}
          </span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex-1 px-5 pb-10 flex flex-col gap-5">
        <OtpInput value={code} onChange={setCode} disabled={busy} />

        {!exists && (
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-[13px] font-semibold text-foreground">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
              autoComplete="name"
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-[15px] text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"
            />
            <p className="text-[12px] text-muted">
              No account yet — we&apos;ll create one with this name.
            </p>
          </div>
        )}

        {error && <p className="text-[13px] text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={busy || code.length !== 6}
          className="w-full py-4 mt-auto rounded-2xl bg-primary text-white font-bold text-[16px] active:opacity-80 transition-opacity disabled:opacity-40"
        >
          {busy ? "Verifying…" : exists ? "Sign in" : "Create account"}
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={busy}
          className="text-[13px] text-muted text-center -mt-2 active:opacity-60 disabled:opacity-40"
        >
          Didn&apos;t get a code? <span className="text-primary font-semibold">Resend</span>
        </button>
      </form>
    </>
  );
}

/* ── 6-digit OTP input ────────────────────────────────── */

function OtpInput({
  value, onChange, disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function setDigit(idx: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      // Treat as deletion of this slot.
      const next = (value.slice(0, idx) + value.slice(idx + 1)).slice(0, 6);
      onChange(next);
      return;
    }
    // Take last typed digit (handles overwrite when slot already filled).
    const ch  = digits[digits.length - 1];
    const arr = value.padEnd(6, " ").split("");
    arr[idx]  = ch;
    const next = arr.join("").replace(/ +$/, "").slice(0, 6);
    onChange(next);
    if (idx < 5) refs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      e.preventDefault();
      const next = value.slice(0, idx - 1) + value.slice(idx);
      onChange(next);
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      e.preventDefault();
      refs.current[idx + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { refs.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] ?? ""}
          onChange={(e) => setDigit(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={idx === 0}
          className="w-12 h-14 text-center text-[22px] font-bold rounded-xl bg-surface border border-border text-foreground outline-none focus:border-primary transition-colors tabular-nums disabled:opacity-50"
        />
      ))}
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────── */

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function WalkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="1.5" />
      <path d="M9 8l-2 5h3l1 5M15 8l2 5h-3l-1 5M12 8v4" />
    </svg>
  );
}
