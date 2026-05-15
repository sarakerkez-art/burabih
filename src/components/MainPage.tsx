import { useEffect, useMemo, useState } from "react";
import {
  Flame, Wind, Baby, Satellite, Signal, Users, Bot,
  HelpCircle, MapPin, Camera, Recycle, Award, Leaf, Github,
  Pencil, Loader2,
} from "lucide-react";
import { WindMark } from "@/components/WindMark";

import { Buri } from "@/components/Buri";
import { fetchAir, type AirSnapshot } from "@/lib/air";
import { type Lang, type Profile, t } from "@/lib/i18n";
import { useServerFn } from "@tanstack/react-start";
import { fetchAdvice } from "@/lib/advice.functions";

type Props = { profile: Profile; lang: Lang; setLang: (l: Lang) => void; onEditProfile: () => void; onHome?: () => void };

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div className="shrink-0 w-12 h-12 rounded-xl bg-sage flex items-center justify-center text-[color:var(--forest)]">
    {children}
  </div>
);

export function MainPage({ profile, lang, setLang, onEditProfile, onHome }: Props) {
  const tr = t(lang);
  const [rawAir, setRawAir] = useState<AirSnapshot | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [demoWinter, setDemoWinter] = useState(false);
  const getAdvice = useServerFn(fetchAdvice);

  useEffect(() => {
    try {
      if (localStorage.getItem("bura.demoWinter") === "1") setDemoWinter(true);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("bura.demoWinter", demoWinter ? "1" : "0"); } catch { /* ignore */ }
  }, [demoWinter]);

  useEffect(() => {
    let alive = true;
    fetchAir(profile.city).then((a) => alive && setRawAir(a));
    return () => { alive = false; };
  }, [profile.city]);

  const WHO_PM25 = 5;
  const WINTER_PM: Record<string, number> = {
    Sarajevo: 89,
    Zenica: 124,
    Tuzla: 67,
    Mostar: 31,
    "Banja Luka": 45,
  };
  const air = useMemo<AirSnapshot | null>(() => {
    if (!rawAir) return rawAir;
    if (!demoWinter) return rawAir;
    const pm25 = WINTER_PM[profile.city] ?? rawAir.pm25 ?? 80;
    return {
      ...rawAir,
      pm25,
      aqi: Math.round(pm25 * 2),
      temp: rawAir.temp ?? -2,
      whoMultiplier: Math.max(1, +(pm25 / WHO_PM25).toFixed(1)),
      stale: false,
    };
  }, [rawAir, demoWinter, profile.city]);

  useEffect(() => {
    if (air == null) return;
    let alive = true;
    setAiLoading(true);
    setAiError(null);
    setAiText(null);
    getAdvice({
      data: {
        city: profile.city,
        heating: profile.heating,
        children: profile.children,
        pm25: air.pm25,
        temp: air.temp ?? null,
        hour: new Date().getHours(),
        lang,
      },
    })
      .then((r) => {
        if (!alive) return;
        if (r.ok) setAiText(r.text);
        else setAiError(r.error ?? "AI nedostupan");
      })
      .catch((e) => { if (alive) setAiError(String(e?.message ?? e)); })
      .finally(() => { if (alive) setAiLoading(false); });
    return () => { alive = false; };
  }, [air, profile.city, profile.heating, profile.children, lang, getAdvice]);

  const pm = air?.pm25 ?? null;
  const x = air ? air.whoMultiplier.toFixed(1) : "-";
  const pmStr = pm != null ? pm.toFixed(0) : "-";
  const showAlert = (pm ?? 0) > 25;

  const famLabel =
    profile.children === "young" ? tr.fam_young :
    profile.children === "older" ? tr.fam_older : tr.fam_none;
  const heatLabel =
    profile.heating === "coal" ? tr.heat_coal :
    profile.heating === "gas" ? tr.heat_gas :
    profile.heating === "district" ? tr.heat_district : tr.heat_unsure;

  const greet = useMemo(() => {
    if ((profile.children === "young" || profile.children === "older") && profile.heating === "coal") {
      return tr.greet_kids_coal(profile.city, x);
    }
    return tr.greet_default(profile.city, pmStr, x);
  }, [profile, x, pmStr, tr]);

  const aiItems = useMemo(() => parseAdvice(aiText), [aiText]);
  const fallbackActions = buildActions(profile, lang);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-5 sm:px-8 py-5 flex items-center justify-between">
        <button
          onClick={onHome}
          className="flex items-center gap-2 hover:opacity-75 transition"
          aria-label="Bura, home"
        >
          <span className="font-bold text-xl tracking-tight">{tr.brand}</span>
          <WindMark size={20} color="var(--forest)" />
        </button>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">{profile.city}</span>
          <button
            onClick={onEditProfile}
            className="text-muted-foreground hover:text-foreground transition"
            aria-label={tr.edit_profile}
            title={tr.edit_profile}
          >
            <Pencil size={16} />
          </button>
          <label
            className="group relative flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={demoWinter}
              onChange={(e) => setDemoWinter(e.target.checked)}
              className="accent-amber-brand"
            />
            ❄
            <span
              role="tooltip"
              className="pointer-events-none absolute top-full right-0 mt-2 w-56 rounded-lg bg-foreground text-background text-[11px] leading-snug px-3 py-2 shadow-lg opacity-0 translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 z-20"
            >
              {lang === "bs"
                ? "Uključi za simulirane zimske vrijednosti zraka."
                : "Toggle to mock winter air values."}
            </span>
          </label>
          <button
            onClick={() => setLang(lang === "bs" ? "en" : "bs")}
            className="font-medium tracking-wide hover:text-accent transition"
          >
            {lang === "bs" ? "BHS · EN" : "EN · BHS"}
          </button>
        </div>
      </header>

      {/* Demo winter mode banner */}
      {demoWinter && (
        <div className="bg-[color:var(--forest)] text-white px-5 sm:px-8 py-2 text-xs sm:text-sm text-center">
          ❄ {lang === "bs" ? "Demo zimski mod — ilustrativni zimski podaci" : "Demo winter mode — illustrative winter data"}
        </div>
      )}

      {/* Amber alert banner */}
      {showAlert && (
        <div className="bg-amber-brand text-[color:var(--accent-foreground)] px-5 sm:px-8 py-3 text-sm sm:text-[15px] font-medium">
          {tr.alert_banner(profile.city, pmStr, x)}
        </div>
      )}

      {/* Section A, Hero */}
      <section className="bg-[color:var(--forest)] text-white px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <Buri pm25={pm} />
          <p className="mt-8 text-xl sm:text-2xl font-semibold leading-snug">
            {tr.greet_morning}{" "}
            <span className="font-normal text-white/90">{greet}</span>
          </p>
          <p className="mt-6 text-sm text-amber-brand">{tr.buri_tag}</p>
        </div>
      </section>

      {/* Section B, AI Actions */}
      <section className="px-5 sm:px-8 py-16 sm:py-24 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{tr.actions_title}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {tr.actions_sub(profile.city, famLabel, heatLabel)}
        </p>

        {aiLoading && (
          <div className="mt-10 flex items-center gap-3 text-muted-foreground">
            <Loader2 size={18} className="animate-spin text-amber-brand" />
            <span className="text-sm">
              {lang === "bs" ? "Buri priprema vaše savjete..." : "Buri is preparing your advice..."}
            </span>
          </div>
        )}

        {!aiLoading && aiItems.length > 0 && (
          <ul className="mt-10 flex flex-col gap-8">
            {aiItems.map((text, i) => (
              <li key={i} className="flex gap-4">
                <IconBox><Wind size={22} /></IconBox>
                <p className="flex-1 text-sm sm:text-base text-foreground/85 leading-relaxed pt-2">{text}</p>
              </li>
            ))}
          </ul>
        )}

        {!aiLoading && aiItems.length === 0 && (
          <ul className="mt-10 flex flex-col gap-8">
            {fallbackActions.map((a, i) => (
              <li key={i} className="flex gap-4">
                <IconBox>{a.icon}</IconBox>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-semibold text-base sm:text-lg leading-snug">{a.title}</h3>
                    <span className="text-[11px] uppercase tracking-wide text-amber-brand font-semibold">{a.tag}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{a.text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {aiError && !aiLoading && (
          <p className="mt-4 text-xs text-muted-foreground italic">
            {lang === "bs" ? "Prikazujemo opće savjete (AI trenutno nedostupan)." : "Showing general advice (AI temporarily unavailable)."}
          </p>
        )}
      </section>

      {/* Section C, Live data strip */}
      <section className="bg-muted px-5 sm:px-8 py-8">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 text-center">
          <Stat label={tr.live_pm} value={pmStr} />
          <Stat label={tr.live_aqi} value={air?.aqi != null ? String(air.aqi) : "-"} />
          <Stat label={tr.live_temp} value={air?.temp ? `${air.temp}°` : "-"} />
        </div>
        <div className="max-w-2xl mx-auto mt-5">
          <PmScale value={pm} lang={lang} />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          {air?.stale
            ? tr.live_stale
            : tr.live_source(air?.updatedMinutesAgo != null ? String(air.updatedMinutesAgo) : "-")}
        </p>
      </section>

      {/* Section D, Why */}
      <section className="px-5 sm:px-8 py-16 sm:py-24 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{tr.why_title}</h2>
        <p className="mt-5 text-base leading-relaxed text-foreground/85">
          {tr.why_text(air?.temp != null ? String(air.temp) : "−2")}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">{tr.why_source}</p>
      </section>

      {/* Section E, Every breath matters */}
      <section className="bg-[color:var(--warm)] px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{tr.ebm_title}</h2>
          <p className="text-base text-muted-foreground mt-2">{tr.ebm_sub}</p>
          <p className="mt-6 text-base leading-relaxed text-foreground/85">{tr.ebm_p(profile.city, x)}</p>
          <p className="mt-4 text-xs italic text-muted-foreground">{tr.ebm_source}</p>
        </div>
      </section>

      {/* Section H, Alert signup */}
      <section className="bg-[color:var(--forest)] text-white px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex justify-center"><WindMark size={28} color="white" /></div>
          <h2 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight">{tr.sub_title}</h2>
          <p className="mt-4 text-amber-brand text-base">{tr.sub_sub}</p>
          <SignupForm tr={tr} />
          <p className="mt-4 text-xs italic text-white/70">{tr.sub_note}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[color:var(--forest)] text-white px-5 sm:px-8 py-14">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10 text-sm items-center">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg">
              {tr.brand} <WindMark size={18} color="white" />
            </div>
            <p className="mt-3 text-white/70">{tr.foot_tag}</p>
          </div>
          <p className="text-center text-amber-brand text-sm">{tr.foot_bottom} ❤</p>
          <div className="text-white/80 sm:text-right">
            <a href="mailto:contact@burabih.org" className="hover:text-amber-brand transition">
              contact@burabih.org
            </a>
            <a
              href="https://github.com"
              className="mt-2 flex items-center gap-2 sm:justify-end hover:text-amber-brand transition"
            >
              <Github size={14} /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- helpers ---------- */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Win({ label, city, text }: { label: string; city: string; text: string }) {
  return (
    <div className="border-l-2 border-[color:var(--amber-brand)] pl-4">
      <div className="text-[11px] uppercase tracking-wide text-amber-brand font-semibold">{label}</div>
      <div className="font-semibold mt-1">{city}</div>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{text}</p>
    </div>
  );
}

function Ranking({ pmCity, pmValue }: { pmCity: string; pmValue: number | null }) {
  const base: { city: string; pm: number }[] = [
    { city: "Mostar", pm: 18.2 },
    { city: "Banja Luka", pm: 28.5 },
    { city: "Sarajevo", pm: 52.1 },
    { city: "Tuzla", pm: 61.0 },
    { city: "Zenica", pm: 74.6 },
  ];
  const data = base.map((b) =>
    b.city === pmCity && pmValue != null ? { ...b, pm: pmValue } : b
  ).sort((a, b) => a.pm - b.pm);
  const max = Math.max(...data.map((d) => d.pm));
  return (
    <ul className="flex flex-col gap-3">
      {data.map((d) => (
        <li key={d.city} className="flex items-center gap-4">
          <span className="w-24 text-sm">{d.city}</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-brand rounded-full transition-all"
              style={{ width: `${(d.pm / max) * 100}%` }}
            />
          </div>
          <span className="w-14 text-right text-sm tabular-nums text-muted-foreground">
            {d.pm.toFixed(1)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function HiwItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div>
      <IconBox>{icon}</IconBox>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function ReportForm({ tr }: { tr: ReturnType<typeof t> }) {
  const [tip, setTip] = useState(false);
  return (
    <form className="mt-10 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
          {tr.rep_loc}
        </label>
        <div className="mt-1 flex items-center gap-2 bg-card border border-input rounded-lg px-4 py-3">
          <MapPin size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Sarajevo, Marijin Dvor…"
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
          {tr.rep_desc}
        </label>
        <textarea
          rows={3}
          placeholder="…"
          className="mt-1 w-full bg-card border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground"
        />
      </div>
      <button type="button" className="text-sm text-muted-foreground inline-flex items-center gap-2 self-start hover:text-foreground transition">
        <Camera size={14} /> {tr.rep_photo}
      </button>
      <div className="flex items-center gap-3">
        <button className="bg-amber-brand text-[color:var(--accent-foreground)] font-semibold px-6 py-3 rounded-full text-sm hover:brightness-95 transition">
          {tr.rep_cta}
        </button>
        <div className="relative">
          <button
            type="button"
            onMouseEnter={() => setTip(true)}
            onMouseLeave={() => setTip(false)}
            onFocus={() => setTip(true)}
            onBlur={() => setTip(false)}
            aria-label={tr.rep_why}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <HelpCircle size={18} />
          </button>
          {tip && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-foreground text-background text-xs rounded-lg p-3 shadow-lg z-10">
              <strong className="block mb-1">{tr.rep_why}</strong>
              {tr.rep_why_text}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

function SignupForm({ tr }: { tr: ReturnType<typeof t> }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  if (done) {
    return <p className="mt-8 text-amber-brand">{tr.sub_done}</p>;
  }
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setDone(true); }}
      className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        required
        placeholder={tr.sub_email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-white text-foreground border border-white/20 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-brand"
      />
      <button className="bg-amber-brand text-[color:var(--accent-foreground)] font-semibold px-6 py-3 rounded-full text-sm hover:brightness-95 transition">
        {tr.sub_cta}
      </button>
    </form>
  );
}

function Roadmap({ tr }: { tr: ReturnType<typeof t> }) {
  const phases = [
    { y: 2026, text: tr.road_p1, active: true },
    { y: 2027, text: tr.road_p2, active: false },
    { y: 2028, text: tr.road_p3, active: false },
    { y: 2029, text: tr.road_p4, active: false, plus: true },
  ];
  return (
    <div className="mt-10 grid sm:grid-cols-4 gap-4 relative">
      <div className="hidden sm:block absolute left-0 right-0 top-3 h-px bg-foreground/10" />
      {phases.map((p, i) => (
        <div key={i} className="group relative">
          <div className="flex items-center gap-2">
            <span
              className={`relative z-10 h-3 w-3 rounded-full transition-colors duration-300 ${
                p.active ? "bg-amber-brand" : "bg-foreground/20 group-hover:bg-amber-brand"
              }`}
            />
          </div>
          <div className="mt-4 p-4 rounded-lg transition-all duration-300 group-hover:bg-white group-hover:border-l-2 group-hover:border-[color:var(--amber-brand)]">
            <div className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground group-hover:text-foreground transition">
              {tr.road_phase} {i + 1} · {p.y}{p.plus ? "+" : ""}
              {p.active && <span className="ml-2 text-amber-brand">· {tr.road_active}</span>}
            </div>
            <p className="mt-2 text-sm text-foreground/80 group-hover:text-foreground transition leading-relaxed">
              {p.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- personalized actions ---------- */
type Action = { icon: React.ReactNode; title: string; tag: string; text: string };

function buildActions(_p: Profile, lang: Lang): Action[] {
  const isBs = lang === "bs";
  return [
    {
      icon: <Wind size={22} />,
      title: isBs ? "Prozračite u 14h, ne ujutro" : "Air out at 2pm, not in the morning",
      tag: isBs ? "NAJČISTIJI ZRAK DANAS" : "CLEANEST AIR TODAY",
      text: isBs
        ? "Vanjski zrak je čišći oko podneva. Otvorite prozore potpuno na 5 minuta između 13h i 15h, pa zatvorite prije večernjeg porasta zagađenja."
        : "Outdoor air is cleanest around midday. Open the windows fully for 5 minutes between 1pm and 3pm, then close them before the evening pollution rise.",
    },
    {
      icon: <Award size={22} />,
      title: isBs ? "Podijelite ovo s komšijom" : "Share this with a neighbour",
      tag: isBs ? "MALI KORAK" : "SMALL STEP",
      text: isBs
        ? "Što više ljudi razumije obrasce, to je manje noćnog dima u vašoj zgradi."
        : "The more people understand the patterns, the less smoke at night in your building.",
    },
  ];
}

function parseAdvice(text: string | null): string[] {
  if (!text) return [];
  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^\s*(?:\d+[.)]|[-*•])\s*/, "").trim())
    .filter(Boolean);
  return lines.length ? lines.slice(0, 3) : [text.trim()];
}
