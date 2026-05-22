import type { FormEvent } from "react";
import OtpInput from "./otp-input";

export default function VerifyStage({
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
