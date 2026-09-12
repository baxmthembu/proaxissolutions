const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

let authToken: string | null = null;
export function setAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? res.statusText, body);
  }
  return body as T;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
};

// ── Typed payloads ────────────────────────────────────────────────────────────
export interface UnlockedToken {
  code: string;
  expiresAt: string;
  ttlSeconds: number;
  voucher: { id: string; title: string; priceCents: number };
  venue: { id: string; name: string };
}

export interface Scarcity {
  voucherId: string;
  remaining: number;
  dailyQuantity: number;
  claimedToday: number;
  heldNow: number;
  microcopy: string[];
}

export interface DashboardData {
  venue: { id: string; name: string; billingTier: string };
  rangeDays: number;
  metrics: {
    totalFootTraffic: number;
    grossRevenueInjectedCents: number;
    commissionDueCents: number;
    offPeakCapacityUtilisation: number | null;
  };
  footTrafficSeries: { date: string; count: number }[];
  promoterLeaderboard: {
    promoterId: string;
    handle: string;
    campus: string | null;
    entries: number;
    commissionCents: number;
  }[];
}

export const formatRand = (cents: number) =>
  `R${(cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 0 })}`;
