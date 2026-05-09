"use client";

// Mock OTP auth — swap requestCode/verifyCode internals for Supabase OTP when ready.
// requestCode  → supabase.auth.signInWithOtp({ email | phone })
// verifyCode   → supabase.auth.verifyOtp({ email | phone, token, type })

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

type RequestCodeResult = { code: string; exists: boolean; error: string | null };
type VerifyCodeResult  = { error: string | null };

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  requestCode: (identifier: string) => Promise<RequestCodeResult>;
  verifyCode: (identifier: string, code: string, name?: string) => Promise<VerifyCodeResult>;
  signOut: () => void;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: false,
  requestCode: async () => ({ code: "", exists: false, error: null }),
  verifyCode:  async () => ({ error: null }),
  signOut: () => {},
});

const STORAGE_KEY = "walkin_user";

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function detectIdentifierType(id: string): "email" | "phone" | null {
  const trimmed = id.trim();
  if (!trimmed) return null;
  if (trimmed.includes("@")) return "email";
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 ? "phone" : null;
}

function normalizeIdentifier(id: string, type: "email" | "phone"): string {
  return type === "email" ? id.trim().toLowerCase() : id.trim().replace(/\s+/g, "");
}

function matchesUser(user: AuthUser, type: "email" | "phone", value: string) {
  return type === "email" ? user.email === value : user.phone === value;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const loading = false;

  // Pending code lives in-memory; refreshing the verify page invalidates it (realistic OTP behavior).
  const pending = useRef<{ identifier: string; code: string } | null>(null);

  const requestCode = useCallback(async (identifier: string): Promise<RequestCodeResult> => {
    const type = detectIdentifierType(identifier);
    if (!type) return { code: "", exists: false, error: "Enter a valid email or phone number." };

    const normalized = normalizeIdentifier(identifier, type);
    const code       = String(Math.floor(100000 + Math.random() * 900000));
    pending.current  = { identifier: normalized, code };

    const stored = readStoredUser();
    const exists = !!stored && matchesUser(stored, type, normalized);

    return { code, exists, error: null };
  }, []);

  const verifyCode = useCallback(async (identifier: string, code: string, name?: string): Promise<VerifyCodeResult> => {
    const type = detectIdentifierType(identifier);
    if (!type) return { error: "Enter a valid email or phone number." };

    const normalized = normalizeIdentifier(identifier, type);
    const issued     = pending.current;
    if (!issued || issued.identifier !== normalized || issued.code !== code) {
      return { error: "Invalid or expired code." };
    }

    const stored      = readStoredUser();
    const isReturning = !!stored && matchesUser(stored, type, normalized);

    let nextUser: AuthUser;
    if (isReturning) {
      nextUser = stored!;
    } else {
      const trimmedName = name?.trim();
      if (!trimmedName) return { error: "Name is required." };
      nextUser = {
        id: crypto.randomUUID(),
        name: trimmedName,
        ...(type === "email" ? { email: normalized } : { phone: normalized }),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    }

    pending.current = null;
    setUser(nextUser);
    return { error: null };
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    pending.current = null;
    setUser(null);
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, requestCode, verifyCode, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
