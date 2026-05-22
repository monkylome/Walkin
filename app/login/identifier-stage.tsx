import type { FormEvent } from "react";

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

export default function IdentifierStage({
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
