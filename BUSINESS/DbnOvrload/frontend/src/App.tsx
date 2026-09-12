import { useEffect } from "react";
import { Routes, Route, Link, useSearchParams } from "react-router-dom";
import { setAuthToken } from "./lib/api";
import { VoucherView } from "./pages/VoucherView";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { CulturePage } from "./seo/CulturePage";
import { SpecialsPage } from "./seo/SpecialsPage";

/**
 * In production an auth token comes from your login flow / secure storage.
 * For the preview we accept ?token= so the protected views (unlock, dashboard)
 * can be demoed end-to-end.
 */
function useDemoAuth() {
  const [search] = useSearchParams();
  useEffect(() => {
    const t = search.get("token");
    if (t) setAuthToken(t);
  }, [search]);
}

export function App() {
  useDemoAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/v/:voucherId" element={<VoucherView />} />
      <Route path="/culture/:neighborhood/:venueSlug" element={<CulturePage />} />
      <Route path="/specials/:campusSlug/:day" element={<SpecialsPage />} />
      <Route path="/owner/:venueId" element={<OwnerDashboard />} />
      <Route path="/membership/return" element={<MembershipReturn />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 bg-pitch px-6 text-center">
      <h1 className="font-display text-5xl font-bold text-volt">DbnOvrload</h1>
      <p className="text-neutral-400">
        Durban Gqom & youth-culture passes. Off-peak combos, line-skip, pay at the till.
      </p>
      <div className="grid gap-2 text-sm">
        <Link to="/culture/kwamashu-g-section/wiseman-shisanyama-carwash" className="text-volt underline">
          Explore a venue →
        </Link>
        <Link to="/specials/ukzn-howard-college/wednesday" className="text-volt underline">
          Specials near my campus →
        </Link>
      </div>
    </main>
  );
}

function MembershipReturn() {
  const [search] = useSearchParams();
  const status = search.get("status") ?? "pending";
  const ok = status === "complete";
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 bg-pitch px-6 text-center">
      <h1 className="font-display text-3xl font-bold" style={{ color: ok ? "#39FF14" : "#00F0FF" }}>
        {ok ? "Ka-Ching — you're Premium" : "Payment " + status}
      </h1>
      <p className="text-neutral-400">
        {ok
          ? "Late-night line-skip, VIP lounge and sound-drops unlocked."
          : "If you completed the Capitec Pay step, your access updates within a few seconds."}
      </p>
      <Link to="/" className="text-volt underline">Back to DbnOvrload</Link>
    </main>
  );
}
