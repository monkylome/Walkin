"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/auth";
import IdentifierStage from "./identifier-stage";
import VerifyStage from "./verify-stage";

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
