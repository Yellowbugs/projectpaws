import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import logo from "./assets/logo.jpg"; // top of your file

/** === CONFIG ===
 * Set REACT_APP_GAS_URL in your .env (no trailing slash), e.g.:
 * REACT_APP_GAS_URL=https://script.google.com/macros/s/AKfycbx.../exec
 */
const GAS_URL = process.env.REACT_APP_GAS_URL || ""; 
const PODIUM_STYLES = {
  1: {
    emoji: "🥇",
    theme: {
      card: "bg-gradient-to-br from-amber-50/80 via-yellow-50/70 to-white/40",
      avatar: "bg-amber-500 text-amber-50",
      memberPill: "bg-amber-200/70 border-amber-900/10 text-stone-900",
      badge: "bg-amber-600 text-amber-50",
    },
  },
  2: {
    emoji: "🥈",
    theme: {
      card: "bg-gradient-to-br from-zinc-50/80 via-gray-50/70 to-white/40",
      avatar: "bg-zinc-500 text-zinc-50",
      memberPill: "bg-zinc-200/70 border-zinc-900/10 text-stone-900",
      badge: "bg-zinc-600 text-zinc-50",
    },
  },
  3: {
    emoji: "🥉",
    theme: {
      card: "bg-gradient-to-br from-orange-50/80 via-amber-50/70 to-white/40",
      avatar: "bg-orange-600 text-orange-50",
      memberPill: "bg-orange-200/70 border-orange-900/10 text-stone-900",
      badge: "bg-orange-700 text-orange-50",
    },
  },
};

const COLOR_STYLES = {
  blue: {
    card: "bg-gradient-to-br from-blue-50/70 via-blue-50/60 to-white/30",
    avatar: "bg-blue-900/90 text-blue-100",
    memberPill: "bg-blue-200/60 border-blue-900/10 text-stone-900",
    badge: "bg-blue-900 text-blue-100",
  },
  yellow: {
    card: "bg-gradient-to-br from-amber-50/70 via-amber-50/60 to-white/30",
    avatar: "bg-amber-900/90 text-amber-100",
    memberPill: "bg-amber-200/60 border-amber-900/10 text-stone-900",
    badge: "bg-amber-900 text-amber-100",
  },
  red: {
    card: "bg-gradient-to-br from-rose-50/70 via-rose-50/60 to-white/30",
    avatar: "bg-rose-900/90 text-rose-100",
    memberPill: "bg-rose-200/60 border-rose-900/10 text-stone-900",
    badge: "bg-rose-900 text-rose-100",
  },
  pink: {
    card: "bg-gradient-to-br from-pink-50/70 via-pink-50/60 to-white/30",
    avatar: "bg-pink-900/90 text-pink-100",
    memberPill: "bg-pink-200/60 border-pink-900/10 text-stone-900",
    badge: "bg-pink-900 text-pink-100",
  },
  green: {
    card: "bg-gradient-to-br from-green-50/70 via-green-50/60 to-white/30",
    avatar: "bg-green-900/90 text-green-100",
    memberPill: "bg-green-200/60 border-green-900/10 text-stone-900",
    badge: "bg-green-900 text-green-100",
  },
  purple: {
    card: "bg-gradient-to-br from-purple-50/70 via-purple-50/60 to-white/30",
    avatar: "bg-purple-900/90 text-purple-100",
    memberPill: "bg-purple-200/60 border-purple-900/10 text-stone-900",
    badge: "bg-purple-900 text-purple-100",
  },
  orange: {
    card: "bg-gradient-to-br from-orange-50/70 via-orange-50/60 to-white/30",
    avatar: "bg-orange-900/90 text-orange-100",
    memberPill: "bg-orange-200/60 border-orange-900/10 text-stone-900",
    badge: "bg-orange-900 text-orange-100",
  },
  teal: {
    card: "bg-gradient-to-br from-teal-50/70 via-teal-50/60 to-white/30",
    avatar: "bg-teal-900/90 text-teal-100",
    memberPill: "bg-teal-200/60 border-teal-900/10 text-stone-900",
    badge: "bg-teal-900 text-teal-100",
  },
  gray: {
    card: "bg-gradient-to-br from-gray-50/70 via-gray-50/60 to-white/30",
    avatar: "bg-gray-900/90 text-gray-100",
    memberPill: "bg-gray-200/60 border-gray-900/10 text-stone-900",
    badge: "bg-gray-900 text-gray-100",
  },
  default: {
    card: "bg-gradient-to-br from-stone-50/70 via-stone-50/60 to-white/30",
    avatar: "bg-stone-900/90 text-amber-100",
    memberPill: "bg-amber-200/60 border-amber-900/10 text-stone-900",
    badge: "bg-stone-900 text-amber-100",
  },
};


function LoadingCard({ lines = 3 }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl p-5 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 ${
            i === 0 ? "w-2/3" : i === lines - 1 ? "w-1/3" : "w-full"
          } bg-stone-300/40 rounded mb-3`}
        />
      ))}
    </div>
  );
}

function Page({ title, right, children }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
          {title}
        </h1>
        {right}
      </div>
      {children}
    </div>
  );
}

function MembersPage({ data }) {
  const scoreToRank = useMemo(() => {
    const scores = (data || []).map(m => Number(m.Points) || 0);
    const uniqDesc = [...new Set(scores)].sort((a, b) => b - a);
    const map = {};
    uniqDesc.forEach((score, i) => { map[score] = i + 1; }); // same score => same rank
    return map;
  }, [data]);
  return (
    <Page title="Members">
      <div className="grid md:grid-cols-2 gap-6">
        {!data?.length ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : (
          data.map((m, idx) => {
            const member = (m.Member || "");
            const colorKey = String(m.Color || m.color || "").toLowerCase();
            const pointsNum = Number(m.Points) || 0;
          
            const rank = scoreToRank[pointsNum]; // 1, 2, 3, ...
            const isPodium = rank >= 1 && rank <= 3;
          
            // if podium, override theme with medal colors; otherwise use sheet color/default
            const baseTheme = COLOR_STYLES[colorKey] || COLOR_STYLES.default;
            const theme = isPodium ? PODIUM_STYLES[rank].theme : baseTheme;
          
            const medalEmoji = isPodium ? PODIUM_STYLES[rank].emoji : null;
          
            return (
              <div
                key={idx}
                className={`rounded-2xl border border-white/25 backdrop-blur-xl shadow-2xl p-5 ${theme.card}`}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold ${theme.avatar}`}>
                      {member?.[0]?.toUpperCase() ?? "P"}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold text-stone-900">{member}</div>
                      {medalEmoji && (
                        <span
                          className="text-2xl"
                          aria-label={rank === 1 ? "Gold medal" : rank === 2 ? "Silver medal" : "Bronze medal"}
                          title={rank === 1 ? "Gold" : rank === 2 ? "Silver" : "Bronze"}
                        >
                          {medalEmoji}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-5xl font-bold text-stone-900">{pointsNum}</div>
                    <div className="text-base font-semibold text-stone-600">
                      point{Math.abs(pointsNum) === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
              </div>
            );          
          })
        )}
      </div>
    </Page>
  );
}


function UpdatesPage({ data, colors }) {
  const sorted = useMemo(() => {
    return [...(data || [])].sort((a, b) => {
      const da = Date.parse(a.Timestamp || "");
      const db = Date.parse(b.Timestamp || "");
      return (isNaN(db) ? 0 : db) - (isNaN(da) ? 0 : da);
    });
  }, [data]);

  return (
    <Page title="Updates">
      {!data?.length ? (
        <div className="grid gap-4">
          <LoadingCard lines={4} />
          <LoadingCard lines={4} />
          <LoadingCard lines={4} />
        </div>
      ) : (
        <div className="grid gap-4">
          {sorted.map((u, i) => {
            const ts = u.Timestamp || "";
            const member = (u.Member || "Member").trim();
            const pts = u.Points ?? "";
            const desc = u.Description || "";
            const dispPts = String(pts).startsWith("+") || String(pts).startsWith("-") ? String(pts) : `+${pts}`;

            const colorKey = (colors?.[member] || "").toLowerCase();
            const theme = COLOR_STYLES[colorKey] || COLOR_STYLES.default;

            return (
              <div
                key={i}
                className={`rounded-2xl border border-white/25 backdrop-blur-xl shadow-xl p-5 ${theme.card}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-stone-500">{timeAgo(ts)}</div>
                    <div className="mt-1 text-lg font-semibold text-stone-900">
                      {dispPts} point{Math.abs(parseInt(dispPts, 10)) === 1 ? "" : "s"}
                    </div>
                    <div className="text-stone-700 mt-1">{desc}</div>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-sm font-semibold h-fit ${theme.badge}`}>
                    {member}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Page>
  );
}


function RulesPage({ data }) {
  return (
    <Page title="Rules & How to Earn Points">
      {!data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          <LoadingCard lines={4} />
          <LoadingCard lines={4} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {data.map((r, i) => {
            const cat = r.Category || "General";
            const rule = r.Rule || "";
            const pts = r.Points ?? "";
            return (
              <div
                key={i}
                className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl shadow-xl p-5 bg-gradient-to-br from-amber-50/70 via-stone-50/70 to-white/30"
              >
                <div className="text-xs uppercase tracking-wider text-stone-600">{cat}</div>
                <div className="mt-1 text-stone-900 font-semibold">{rule}</div>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200/70 text-stone-900 border border-amber-900/10 text-sm">
                  <span className="font-bold">{pts}</span>
                  <span>points</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Page>
  );
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // in seconds

  if (isNaN(diff) || diff < 0) return dateString; // fallback if invalid

  if (diff < 60) return `${diff}s ago`;
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}


function Nav() {
  const linkBase =
    "px-4 py-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow hover:bg-white/20 transition";
  const inactive = "text-stone-700";
  const active = "text-stone-900 font-semibold bg-white/40";

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-gradient-to-b from-amber-100/70 to-transparent backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Left side: logo + title */}
          <div className="flex items-center gap-3">
          <img
              src={logo}
              alt="Project PAWS Logo"
              className="h-12 w-12 rounded-xl object-cover shadow-md"
            />
            <div className="text-lg font-extrabold tracking-tight text-stone-900">
              Project PAWS PSU
            </div>
          </div>

          {/* Right side: nav links */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
            >
              Members
            </NavLink>
            <NavLink
              to="/updates"
              className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
            >
              Updates
            </NavLink>
            <NavLink
              to="/rules"
              className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
            >
              Rules
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
            

function Background() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(28,25,23,0.08)_1px,transparent_1px)] [background-size:18px_18px] bg-amber-50"
    />
  );
}

export default function App() {
  const [members, setMembers] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [rules, setRules] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const colorMap = useMemo(() => {
    const map = {};
    for (const m of members) {
      const name = (m.member || m.Member || "").trim();
      const color = String(m.Color || m.color || "").trim().toLowerCase();
      if (name) map[name] = color;
    }
    return map;
  }, [members]);
  
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!GAS_URL) {
          throw new Error("Missing REACT_APP_GAS_URL (.env).");
        }
        setStatus("loading");
        const res = await fetch(`${GAS_URL}?cacheBust=${Date.now()}`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const json = await res.json();
        if (cancelled) return;
        const membersData = json.members || [];
        membersData.sort((a, b) => (b.Points || 0) - (a.Points || 0));
        setMembers(membersData || []);
        setUpdates(json.updates || []);
        setRules(json.rules || []);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Failed to load data");
        setStatus("error");
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen">
      <Background />
      <Nav />

      {/* Loading banner */}
      {status === "loading" && (
        <div className="mx-auto max-w-6xl px-4 mt-6">
          <div className="rounded-2xl border border-white/20 bg-white/40 backdrop-blur-md shadow p-4 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-stone-900 animate-ping" />
            <div className="text-stone-800 font-medium">Fetching club data…</div>
          </div>
        </div>
      )}

      {/* Error banner */}
      {status === "error" && (
        <div className="mx-auto max-w-6xl px-4 mt-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-800 p-4">
            <div className="font-semibold">Error</div>
            <div className="text-sm mt-1">{error}</div>
            <div className="text-sm mt-2 text-red-700/80">
              Ensure your Apps Script Web App is deployed and public, and that REACT_APP_GAS_URL is set.
            </div>
          </div>
        </div>
      )}

    <Routes>
      <Route path="/" element={<MembersPage data={members} />} />
      <Route path="/updates" element={<UpdatesPage data={updates} colors={colorMap} />} />
      <Route path="/rules" element={<RulesPage data={rules} />} />
    </Routes>

    </div>
  );
}
