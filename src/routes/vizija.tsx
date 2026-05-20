import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wind, Droplets, Trees, Check, Github } from "lucide-react";
import { WindMark } from "@/components/WindMark";
import { MobileNav } from "@/components/MobileNav";
import { type Lang, t } from "@/lib/i18n";

export const Route = createFileRoute("/vizija")({
  head: () => ({
    meta: [
      { title: "Bura · Naša vizija" },
      {
        name: "description",
        content:
          "Bura raste zajedno s vama – za čist zrak, čistu vodu i čistu prirodu na Zapadnom Balkanu.",
      },
      { property: "og:title", content: "Bura · Naša vizija" },
      {
        property: "og:description",
        content: "Roadmap za Bura: zrak, voda i okolina na Zapadnom Balkanu.",
      },
    ],
  }),
  component: VizijaPage,
});

const LKEY = "bura.lang.v1";

type Phase = {
  num: string;
  title: string;
  when: string;
  body: string;
  Icon: React.ComponentType<{ size?: number }>;
  active: boolean;
};

function VizijaPage() {
  const [lang, setLang] = useState<Lang>("bs");

  useEffect(() => {
    try { localStorage.removeItem(LKEY); } catch { /* ignore */ }
    setLang("bs");
  }, []);

  const tr = t(lang);

  const L = lang === "bs"
    ? {
        eyebrow: "NAŠA VIZIJA",
        title: "Bura raste s vama.",
        sub: "Krećemo od zraka. Slijede voda i čitava okolina. Korak po korak, gradimo otvorenu platformu za Zapadni Balkan.",
        active_label: "AKTIVNO",
        soon_label: "USKORO",
        tagline: "Bura raste zajedno s vama – za čist zrak, čistu vodu i čistu prirodu na Zapadnom Balkanu.",
        nav_home: "Početna",
        phases: [
          {
            num: "Faza 1",
            title: "Zrak",
            when: "Aktivno sada",
            body: "PM2.5, AQI i temperatura za gradove širom BiH. Jednostavne preporuke prilagođene vašoj porodici i grijanju.",
            Icon: Wind,
            active: true,
          },
          {
            num: "Faza 2",
            title: "Voda",
            when: "Dolazi 2026.",
            body: "Kvalitet rijeka i pitke vode. Una, Neretva, Vrbas, Drina – pratimo zdravlje naših voda i upozoravamo na zagađenja.",
            Icon: Droplets,
            active: false,
          },
          {
            num: "Faza 3",
            title: "Okolina",
            when: "Dolazi 2027.",
            body: "Ilegalne deponije, rizik od šumskih požara i kompletna ekološka platforma za Zapadni Balkan.",
            Icon: Trees,
            active: false,
          },
        ] as Phase[],
      }
    : {
        eyebrow: "OUR VISION",
        title: "Bura grows with you.",
        sub: "We start with air. Water and the wider environment follow. Step by step, we are building an open platform for the Western Balkans.",
        active_label: "ACTIVE",
        soon_label: "COMING SOON",
        tagline: "Bura grows with you – for clean air, clean water and clean nature across the Western Balkans.",
        nav_home: "Home",
        phases: [
          {
            num: "Phase 1",
            title: "Air",
            when: "Active now",
            body: "PM2.5, AQI and temperature for cities across BiH. Simple recommendations tailored to your family and heating.",
            Icon: Wind,
            active: true,
          },
          {
            num: "Phase 2",
            title: "Water",
            when: "Coming 2026",
            body: "Quality of rivers and drinking water. Una, Neretva, Vrbas, Drina – we follow the health of our waters and warn about pollution.",
            Icon: Droplets,
            active: false,
          },
          {
            num: "Phase 3",
            title: "Environment",
            when: "Coming 2027",
            body: "Illegal dumps, wildfire risk and a complete environmental platform for the Western Balkans.",
            Icon: Trees,
            active: false,
          },
        ] as Phase[],
      };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 py-6 flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-2 hover:opacity-75 transition">
          <span className="font-bold text-xl tracking-tight">{tr.brand}</span>
          <WindMark size={20} color="var(--forest)" />
        </Link>
        <nav className="hidden sm:flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition font-medium">
            {L.nav_home}
          </Link>
          <Link to="/skole" className="text-foreground/80 hover:text-foreground transition font-medium">
            {lang === "bs" ? "Škole" : "Schools"}
          </Link>
          <Link to="/vizija" className="text-foreground hover:text-foreground transition font-semibold">
            {lang === "bs" ? "Naša vizija" : "Our vision"}
          </Link>
          <Link to="/partner" className="text-foreground/80 hover:text-foreground transition font-medium">
            {lang === "bs" ? "Partneri" : "Partners"}
          </Link>
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
            { label: L.nav_home, to: "/" },
            { label: lang === "bs" ? "Škole" : "Schools", to: "/skole" },
            { label: lang === "bs" ? "Naša vizija" : "Our vision", to: "/vizija" },
            { label: lang === "bs" ? "Partneri" : "Partners", to: "/partner" },
          ]}
        />
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-10 pb-12 text-center">
        <p className="text-xs tracking-[0.2em] text-[color:var(--forest)]/70 font-medium mb-4">{L.eyebrow}</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">{L.title}</h1>
        <p className="text-base sm:text-lg text-foreground/70 leading-relaxed">{L.sub}</p>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-20">
        <ol className="relative">
          {/* vertical line */}
          <span
            aria-hidden
            className="absolute left-6 top-2 bottom-2 w-px bg-[color:var(--forest)]/20"
          />
          {L.phases.map((p, i) => (
            <li key={i} className="relative pl-20 pb-12 last:pb-0">
              {/* dot/icon */}
              <div
                className={
                  "absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center " +
                  (p.active
                    ? "bg-[color:var(--forest)] text-white shadow-lg"
                    : "bg-background border-2 border-[color:var(--forest)]/30 text-[color:var(--forest)]/50")
                }
              >
                <p.Icon size={22} />
                {p.active && (
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-brand text-[color:var(--forest)] flex items-center justify-center border-2 border-background">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>

              <div
                className={
                  "rounded-2xl p-6 transition " +
                  (p.active
                    ? "bg-[color:var(--forest)] text-white shadow-xl"
                    : "border-2 border-dashed border-[color:var(--forest)]/25 text-foreground/70")
                }
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span
                    className={
                      "text-[11px] tracking-[0.18em] font-semibold " +
                      (p.active ? "text-white/70" : "text-foreground/50")
                    }
                  >
                    {p.num.toUpperCase()}
                  </span>
                  <span
                    className={
                      "text-[10px] tracking-[0.18em] font-semibold rounded-full px-2.5 py-1 " +
                      (p.active
                        ? "bg-amber-brand text-[color:var(--forest)]"
                        : "bg-[color:var(--forest)]/10 text-[color:var(--forest)]/70")
                    }
                  >
                    {p.active ? L.active_label : L.soon_label}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">{p.title}</h2>
                <p className={"text-sm font-medium mb-3 " + (p.active ? "text-white/80" : "text-foreground/55")}>
                  {p.when}
                </p>
                <p className={"text-[15px] leading-relaxed " + (p.active ? "text-white/90" : "text-foreground/75")}>
                  {p.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-center text-base sm:text-lg italic text-[color:var(--forest)]/80 max-w-xl mx-auto leading-relaxed">
          {L.tagline}
        </p>
      </section>

      <footer className="bg-[color:var(--forest)] text-white px-5 sm:px-8 py-14 border-t border-white/10">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10 text-sm items-center text-left">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg">
              {tr.brand} <WindMark size={18} color="white" />
            </div>
            <p className="mt-3 text-white/70">{tr.foot_tag}</p>
          </div>
          <p className="sm:text-center text-amber-brand text-sm">{tr.foot_bottom} ❤</p>
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
        <p className="max-w-3xl mx-auto mt-8 text-left sm:text-center text-xs text-white/75 leading-relaxed">
          {tr.foot_beta}
        </p>
      </footer>
    </div>
  );
}
