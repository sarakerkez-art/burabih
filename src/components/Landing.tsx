import { Link } from "@tanstack/react-router";
import { Github, Leaf, Satellite, Signal, Users, Bot, MapPin, Camera, HelpCircle, Baby } from "lucide-react";
import { useState } from "react";
import { Buri } from "./Buri";
import { WindMark } from "./WindMark";
import { SchoolsTeaser } from "./SchoolsTeaser";
import { MobileNav } from "./MobileNav";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div className="shrink-0 w-12 h-12 rounded-xl bg-sage flex items-center justify-center text-[color:var(--forest)]">
    {children}
  </div>
);

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  onOpen: () => void;
};

export function Landing({ lang, setLang, onOpen }: Props) {
  const tr = t(lang);
  const L = lang === "bs"
    ? {
        cta_open: "Otvori aplikaciju",
        cta_more: "Saznaj više",
        hero_eyebrow: "LIČNI EKOLOŠKI ASISTENT ZA RODITELJE U BiH",
        hero_title: "Znajte šta vaša djeca dišu, svako jutro.",
        hero_sub: "Bura nije još jedan dashboard. Bura je povjerljiv jutarnji saputnik koji vam za 5 sekundi kaže šta je u zraku i šta možete učiniti danas.",
        buri_bubble: "Ćao! Ja sam Buri. Puham kroz gradove BiH i znam kakav je zrak svuda.",
        buri_caption: "Hajde da vidimo kakav je danas zrak u tvom gradu.",
        what_title: "Šta je Bura?",
        what_p1: "Sateliti odozgo. Senzori na zemlji. Prijave komšija. Bura spaja sve u jednu jednostavnu poruku, prilagođenu vašem gradu, vašem grijanju, vašoj djeci.",
        what_p2: "Bez prijave. Vaši podaci su sigurni. Nikada ih ne prodajemo. Besplatno zauvijek.",
        mission_title: "Naša misija",
        mission_p: "Bura ne optužuje. Bura čini nevidljivo vidljivim, kako bi porodice mogle donijeti odluke koje štite zdravlje njihove djece.",
        partners_title: "Otvoreni podaci",
        partners_p: "Podaci: EU Copernicus · OpenAQ · aqicn.org · Federalni Hidrometeorološki Zavod BiH",
        final_tag: "Svaki dah je važan. ❤️",
      }
    : {
        cta_open: "Open the app",
        cta_more: "Learn more",
        hero_eyebrow: "A PERSONAL ENVIRONMENTAL ASSISTANT FOR PARENTS IN BiH",
        hero_title: "Know what your children breathe, every morning.",
        hero_sub: "Bura isn't another dashboard. Bura is a trusted morning companion that tells you in 5 seconds what's in the air and what you can do about it today.",
        buri_bubble: "Hi! I'm Buri. I blow through the cities of BiH and I know what the air is like everywhere.",
        buri_caption: "Let's see what the air is like in your city today.",
        what_title: "What is Bura?",
        what_p1: "Satellites above. Sensors on the ground. Reports from neighbours. Bura connects them into one simple message, tailored to your city, your heating, your children.",
        what_p2: "No login. Your data is safe. We never sell it. Free forever.",
        mission_title: "Our mission",
        mission_p: "Bura doesn't accuse. Bura makes the invisible visible, so families can make decisions that protect their children's health.",
        partners_title: "Open data",
        partners_p: "Data: EU Copernicus · OpenAQ · aqicn.org · Federalni Hidrometeorološki Zavod BiH",
        final_tag: "Every breath matters. ❤️",
      };

  const scrollToMore = () => {
    document.getElementById("more")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-6 flex items-center justify-between max-w-6xl mx-auto">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 hover:opacity-75 transition"
          aria-label="Bura, home"
        >
          <span className="font-bold text-xl tracking-tight">{tr.brand}</span>
          <WindMark size={20} color="var(--forest)" />
        </button>
        <nav className="hidden sm:flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
          <Link
            to="/skole"
            className="text-foreground/80 hover:text-foreground transition font-medium"
          >
            {lang === "bs" ? "Škole" : "Schools"}
          </Link>
          <Link
            to="/vizija"
            className="text-foreground/80 hover:text-foreground transition font-medium"
          >
            {lang === "bs" ? "Naša vizija" : "Our vision"}
          </Link>
          <button
            onClick={onOpen}
            className="text-foreground/80 hover:text-amber-brand transition font-medium"
          >
            {lang === "bs" ? "Zrak u mom gradu" : "Air in my city"}
          </button>
        </nav>
        <div className="hidden sm:flex items-center gap-2 text-xs tracking-wide">
          <button
            onClick={() => setLang("bs")}
            className={`hover:text-amber-brand transition ${lang === "bs" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
          >
            BHS
          </button>
          <span className="text-muted-foreground">·</span>
          <button
            onClick={() => setLang("en")}
            className={`hover:text-amber-brand transition ${lang === "en" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
          >
            EN
          </button>
        </div>
        <MobileNav
          lang={lang}
          setLang={setLang}
          items={[
            { label: lang === "bs" ? "Škole" : "Schools", to: "/skole" },
            { label: lang === "bs" ? "Naša vizija" : "Our vision", to: "/vizija" },
            { label: lang === "bs" ? "Zrak u mom gradu" : "Air in my city", onClick: onOpen },
          ]}
        />
      </header>

      {/* Hero */}
      <section className="px-6 max-w-6xl mx-auto pt-8 pb-20 sm:pt-16 sm:pb-28">
        <div className="grid sm:grid-cols-[1.3fr_1fr] gap-10 items-center">
          <div className="fade-up">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-5">
              {L.hero_eyebrow}
            </p>
            <h1 className="font-bold text-4xl sm:text-6xl leading-[1.05] tracking-tight">
              {L.hero_title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              {L.hero_sub}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpen}
                className="bg-amber-brand text-[color:var(--accent-foreground)] font-semibold px-7 py-4 rounded-full text-base transition hover:brightness-95"
              >
                {L.cta_open} →
              </button>
              <button
                onClick={scrollToMore}
                className="border border-foreground/15 text-foreground font-medium px-7 py-4 rounded-full text-base transition hover:border-foreground/40 hover:bg-card"
              >
                {L.cta_more}
              </button>
            </div>
          </div>
          <div
            className="rounded-3xl p-10 flex items-center justify-center aspect-square sm:aspect-auto sm:h-80"
            style={{ background: "var(--forest)" }}
          >
            <Buri
              pm25={8}
              lang={lang}
              bubbleText={L.buri_bubble}
              captionText={L.buri_caption}
            />
          </div>
        </div>
      </section>

      {/* What is Bura */}
      <section id="more" className="px-6 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
            {L.what_title}
          </p>
          <p className="text-2xl sm:text-3xl leading-snug font-medium">
            {L.what_p1}
          </p>
          <p className="mt-5 text-base text-muted-foreground">{L.what_p2}</p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
            {L.mission_title}
          </p>
          <p className="text-2xl sm:text-3xl leading-snug font-medium">{L.mission_p}</p>
        </div>
      </section>

      {/* Partners */}
      <section className="px-6 py-16 border-t border-border" style={{ background: "var(--sage)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
            {L.partners_title}
          </p>
          <p className="text-base">{L.partners_p}</p>
        </div>
      </section>

      {/* Schools teaser */}
      <SchoolsTeaser lang={lang} />

      {/* What's already working */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{tr.work_title}</h2>
            <Leaf size={22} className="text-[color:var(--forest)]" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{tr.work_sub}</p>

          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            <Win label={tr.work_eu} city={tr.work_eu_city} text={tr.work_eu_text} />
            <Win label={tr.work_rec} city={tr.work_rec_city} text={tr.work_rec_text} />
            <Win label={tr.work_air} city={tr.work_air_city} text={tr.work_air_text} />
          </div>

          <div className="mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {tr.ranking}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">{tr.ranking_note}</p>
            <Ranking />
            <p className="mt-4 text-xs text-muted-foreground">{tr.ranking_source}</p>
            <p className="mt-2 text-xs italic text-muted-foreground/80">{tr.ranking_disclaimer}</p>
          </div>
        </div>
      </section>

      {/* Report, your eyes help */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {tr.rep_title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">{tr.rep_sub}</p>

          <div className="mt-8 grid sm:grid-cols-3 gap-5">
            {[
              { icon: <Satellite size={22} />, text: tr.rep_b1 },
              { icon: <Signal size={22} />, text: tr.rep_b2 },
              { icon: <Baby size={22} />, text: tr.rep_b3 },
            ].map((b, i) => (
              <div key={i} className="flex sm:flex-col gap-3">
                <IconBox>{b.icon}</IconBox>
                <p className="text-sm text-foreground/80">{b.text}</p>
              </div>
            ))}
          </div>

          <ReportForm tr={tr} />
        </div>
      </section>

      {/* How it works, open data */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{tr.hiw_title}</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <HiwItem icon={<Satellite size={22} />} title={tr.hiw_a} text={tr.hiw_a_t} />
            <HiwItem icon={<Signal size={22} />} title={tr.hiw_b} text={tr.hiw_b_t} />
            <HiwItem icon={<Users size={22} />} title={tr.hiw_c} text={tr.hiw_c_t} />
            <HiwItem icon={<Bot size={22} />} title={tr.hiw_d} text={tr.hiw_d_t} />
          </div>
        </div>
      </section>

      {/* Roadmap timeline */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{tr.road_title}</h2>
          <Roadmap tr={tr} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 text-center border-t border-border">
        <button
          onClick={onOpen}
          className="bg-amber-brand text-[color:var(--accent-foreground)] font-semibold px-8 py-4 rounded-full text-base transition hover:brightness-95"
        >
          {L.cta_open} →
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[color:var(--forest)] text-white px-6 py-14">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10 text-sm items-center">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg">
              {tr.brand} <WindMark size={18} color="white" />
            </div>
            <p className="mt-3 text-white/70">{tr.foot_tag}</p>
          </div>
          <p className="text-left sm:text-center text-amber-brand text-sm">{tr.foot_bottom} ❤</p>
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
        <p className="max-w-3xl mx-auto mt-10 text-left sm:text-center text-xs italic text-white/60 leading-relaxed">
          {tr.foot_disclaimer}
        </p>
      </footer>
    </div>
  );
}

/* ---------- helpers ---------- */

function Win({ label, city, text }: { label: string; city: string; text: string }) {
  return (
    <div className="border-l-2 border-[color:var(--amber-brand)] pl-4">
      <div className="text-[11px] uppercase tracking-wide text-amber-brand font-semibold">{label}</div>
      <div className="font-semibold mt-1">{city}</div>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{text}</p>
    </div>
  );
}

function Ranking() {
  const data = [
    { city: "Mostar", pm: 18.2 },
    { city: "Banja Luka", pm: 28.5 },
    { city: "Sarajevo", pm: 52.1 },
    { city: "Tuzla", pm: 61.0 },
    { city: "Zenica", pm: 74.6 },
  ].sort((a, b) => a.pm - b.pm);
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
          <div className="mt-4 p-4 rounded-lg transition-all duration-300 group-hover:bg-card group-hover:border-l-2 group-hover:border-[color:var(--amber-brand)]">
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
