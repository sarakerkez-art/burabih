import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  Sparkles,
  TrendingUp,
  Users,
  Heart,
  Newspaper,
  CheckCircle2,
  Github,
  Loader2,
} from "lucide-react";
import { WindMark } from "@/components/WindMark";
import { MobileNav } from "@/components/MobileNav";
import { type Lang, t } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

type Props = { lang: Lang };

type Copy = {
  nav_home: string;
  nav_schools: string;
  nav_vision: string;
  nav_partner: string;

  // Hero
  hero_eyebrow: string;
  hero_title: string;
  hero_sub: string;
  hero_cta: string;

  // Why now
  why_eyebrow: string;
  why_title: string;
  why_body: string[];
  why_sources: string;
  why_stats?: { value: string; label: string }[];

  // What is Bura
  what_eyebrow: string;
  what_title: string;
  what_body: string[];
  what_stats: { source: string; note: string }[];

  // Who can help
  who_eyebrow: string;
  who_title: string;
  who_cards: {
    Icon: React.ComponentType<{ size?: number }>;
    title: string;
    body: string;
    cta: string;
    typeValue: string;
  }[];

  // Contact form
  form_eyebrow: string;
  form_title: string;
  form_sub: string;
  form_name: string;
  form_email: string;
  form_type: string;
  form_type_placeholder: string;
  form_type_options: { value: string; label: string }[];
  form_message: string;
  form_cta: string;
  form_sending: string;
  form_done_title: string;
  form_done_body: string;
  form_error: string;

  // Footer quote
  quote: string;
  quote_attrib: string;
};

const placeholderIcon = Sparkles;

const copy: Record<Lang, Copy> = {
  bs: {
    nav_home: "Početna",
    nav_schools: "Škole",
    nav_vision: "Naša vizija",
    nav_partner: "Partneri",

    hero_eyebrow: "PARTNERI",
    hero_title: "Bura ne može sama.",
    hero_sub: "Podaci postoje. Tehnologija postoji. Ono što nedostaje su ljudi koji vjeruju da BiH zaslužuje bolje.",
    hero_cta: "Javite se",

    why_eyebrow: "ZAŠTO SADA",
    why_title: "Zrak u BiH ubija 3.300 ljudi godišnje. A većina porodica to ne zna.",
    why_body: [
      "Sarajevo je redovno među najzagađenijim gradovima na svijetu tokom zime. Svako peto dijete u BiH pati od respiratornih problema. Podaci postoje, ali nikad ne stignu do onih kojima su najpotrebniji.",
      "Bura to mijenja. Ali ne može sama.",
    ],
    why_sources: "Izvori: UNICEF BiH · EEA 2025 · IQAir 2024",

    what_eyebrow: "ŠTA JE BURA",
    what_title: "Nismo još jedan dashboard.",
    what_body: [
      "Bura je personalizirani ekološki asistent za porodice u BiH. Svako jutro, na osnovu živih podataka o kvalitetu zraka, Bura kaže roditeljima šta njihova djeca dišu i šta mogu učiniti danas.",
      "Ne brojeve. Konkretne savjete. Na bosanskom. Besplatno. Zauvijek.",
    ],
    what_stats: [
      { source: "burabih.org", note: "živi prototip" },
      { source: "Claude AI", note: "personalizirani savjeti" },
      { source: "aqicn.org", note: "živi podaci za BiH" },
    ],

    who_eyebrow: "KO MOŽE POMOĆI",
    who_title: "Tražimo partnere iz raznih oblasti.",
    who_cards: [
      {
        Icon: Newspaper,
        title: "Imate priču. Mi imamo podatke.",
        body: "Bura gradi prvi verifikovani sloj podataka o okolišu u BiH: kvalitet zraka, ilegalne deponije, napredak gradova. Sve dostupno novinarima i istraživačkim medijima.",
        cta: "Koristite naše podatke →",
        typeValue: "media",
      },
      {
        Icon: Users,
        title: "Borite se za čišći zrak? Mi gradimo alat koji vam treba.",
        body: "Ekološki aktivizam bez podataka je težak. Bura daje NGO-ima verifikovanu osnovu za zagovaranje: brojeve koje niko ne može osporiti, jer dolaze direktno iz EU satelita i zvaničnih stanica.",
        cta: "Postanite partner →",
        typeValue: "ngo",
      },
      {
        Icon: Heart,
        title: "Otišli ste iz Bosne. Bosna nije otišla iz vas.",
        body: "Hiljade Bosanaca u Beču, Berlinu, Zürichu pita se kako pomoći. Bura je konkretan odgovor: platforma koja štiti djecu koje volite, u gradu iz kojeg dolazite.",
        cta: "Podržite Bura →",
        typeValue: "diaspora",
      },
      {
        Icon: TrendingUp,
        title: "Gradimo infrastrukturu koju BiH nikad nije imala.",
        body: "Bura nije samo aplikacija. Bura je ekološki operativni sistem za Zapadni Balkan: zrak, voda, otpad, od BiH do regije. Trenutno apliciramo za UNICEF Venture Fund.",
        cta: "Razgovarajmo →",
        typeValue: "investor",
      },
    ],

    form_eyebrow: "KONTAKT",
    form_title: "Zainteresirani ste?",
    form_sub: "Recite nam ko ste i kako možemo sarađivati.",
    form_name: "IME",
    form_email: "EMAIL",
    form_type: "TIP SARADNJE",
    form_type_placeholder: "Odaberite",
    form_type_options: [
      { value: "media", label: "Novinar/ka ili medij" },
      { value: "ngo", label: "NGO ili aktivizam" },
      { value: "diaspora", label: "Dijaspora" },
      { value: "investor", label: "Investitor/ka" },
      { value: "other", label: "Nešto drugo" },
    ],
    form_message: "PORUKA (opcionalno)",
    form_cta: "Pošaljite poruku",
    form_sending: "Šaljem...",
    form_done_title: "Hvala!",
    form_done_body: "Javit ćemo vam se u roku 48 sati. 🌬️",
    form_error: "Došlo je do greške. Pokušajte ponovo.",

    quote: "Bura ne optužuje. Bura čini nevidljivo vidljivim.",
    quote_attrib: "",
  },
  en: {
    nav_home: "Home",
    nav_schools: "Schools",
    nav_vision: "Our vision",
    nav_partner: "Partners",

    hero_eyebrow: "PARTNERS",
    hero_title: "Bura cannot do this alone.",
    hero_sub: "The data exists. The technology exists. What's missing are the people who believe BiH deserves better.",
    hero_cta: "Get in touch",

    why_eyebrow: "WHY NOW",
    why_title: "Air pollution kills 3,300 people in BiH every year. Most families don't know it.",
    why_body: [
      "Sarajevo regularly ranks among the world's most polluted cities in winter. 1 in 5 children in BiH suffers from respiratory problems. The data exists, but never reaches the families who need it most.",
      "Bura changes that. But not alone.",
    ],
    why_sources: "Sources: UNICEF BiH · EEA 2025 · IQAir 2024",

    what_eyebrow: "WHAT IS BURA",
    what_title: "We are not another dashboard.",
    what_body: [
      "Bura is a personalised environmental assistant for families in BiH. Every morning, based on live air quality data, Bura tells parents what their children are breathing and what they can do about it today.",
      "Not numbers. Concrete actions. In Bosnian. Free. Forever.",
    ],
    what_stats: [
      { source: "burabih.org", note: "live prototype" },
      { source: "Claude AI", note: "personalised advice" },
      { source: "aqicn.org", note: "live BiH data" },
    ],

    who_eyebrow: "WHO CAN HELP",
    who_title: "We are looking for partners across sectors.",
    who_cards: [
      {
        Icon: Newspaper,
        title: "You have the story. We have the data.",
        body: "Bura is building the first verified environmental data layer in BiH: air quality, illegal dump sites, city progress. Available to journalists and investigative media.",
        cta: "Use our data →",
        typeValue: "media",
      },
      {
        Icon: Users,
        title: "Fighting for clean air? We're building the tool you need.",
        body: "Environmental activism without data is an uphill battle. Bura gives NGOs a verified foundation for advocacy: numbers no one can dispute, because they come directly from EU satellites and official monitoring stations.",
        cta: "Become a partner →",
        typeValue: "ngo",
      },
      {
        Icon: Heart,
        title: "You left Bosnia. Bosnia never left you.",
        body: "Thousands of Bosnians in Vienna, Berlin, Zürich wonder how to help. Bura is a concrete answer: a platform that protects the children you love, in the city you come from.",
        cta: "Support Bura →",
        typeValue: "diaspora",
      },
      {
        Icon: TrendingUp,
        title: "We're building the infrastructure BiH never had.",
        body: "Bura is not just an app. Bura is the environmental operating system for the Western Balkans: air, water, waste, from BiH to the region. Currently applying to the UNICEF Venture Fund.",
        cta: "Let's talk →",
        typeValue: "investor",
      },
    ],

    form_eyebrow: "CONTACT",
    form_title: "Interested?",
    form_sub: "Tell us who you are and how we can work together.",
    form_name: "NAME",
    form_email: "EMAIL",
    form_type: "TYPE OF COLLABORATION",
    form_type_placeholder: "Select one",
    form_type_options: [
      { value: "media", label: "Journalist or media" },
      { value: "ngo", label: "NGO or activism" },
      { value: "diaspora", label: "Diaspora" },
      { value: "investor", label: "Investor" },
      { value: "other", label: "Something else" },
    ],
    form_message: "MESSAGE (optional)",
    form_cta: "Send message",
    form_sending: "Sending...",
    form_done_title: "Thank you!",
    form_done_body: "We'll be in touch within 48 hours. 🌬️",
    form_error: "Something went wrong. Please try again.",

    quote: "Bura does not point fingers. Bura makes the invisible visible.",
    quote_attrib: "",
  },
};

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  type: z.string().min(1).max(60),
  message: z.string().trim().max(2000).optional().default(""),
});

export function PartnerPage({ lang }: Props) {
  const tr = t(lang);
  const L = copy[lang];

  const altPath = lang === "bs" ? "/en/partner" : "/partner";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const parsed = schema.safeParse({ name, email, type, message });
    if (!parsed.success) {
      setErr(L.form_error);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("partner_interest").insert(parsed.data);
      if (error) throw error;
      setDone(true);
    } catch {
      setErr(L.form_error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
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
            {L.nav_schools}
          </Link>
          <Link to="/vizija" className="text-foreground/80 hover:text-foreground transition font-medium">
            {L.nav_vision}
          </Link>
          <Link
            to={lang === "bs" ? "/partner" : "/en/partner"}
            className="text-foreground hover:text-foreground transition font-semibold"
          >
            {L.nav_partner}
          </Link>
        </nav>
        <div className="hidden sm:flex items-center gap-2 text-xs tracking-wide">
          <Link
            to="/partner"
            className={`hover:text-amber-brand transition ${lang === "bs" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
          >
            BHS
          </Link>
          <span className="text-muted-foreground">·</span>
          <Link
            to="/en/partner"
            className={`hover:text-amber-brand transition ${lang === "en" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
          >
            EN
          </Link>
        </div>
        <MobileNav
          lang={lang}
          setLang={(l) => {
            if (typeof window !== "undefined") {
              window.location.href = l === "bs" ? "/partner" : "/en/partner";
            }
          }}
          items={[
            { label: L.nav_home, to: "/" },
            { label: L.nav_schools, to: "/skole" },
            { label: L.nav_vision, to: "/vizija" },
            { label: L.nav_partner, to: lang === "bs" ? "/partner" : "/en/partner" },
          ]}
        />
      </header>

      {/* 1. Hero - full width teal */}
      <section className="w-full bg-[color:var(--forest)] text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center">
          <p className="text-xs tracking-[0.25em] text-white/70 font-medium mb-5">{L.hero_eyebrow}</p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight mb-6">{L.hero_title}</h1>
          <p className="text-base sm:text-xl text-white/85 leading-relaxed max-w-2xl mx-auto mb-8">
            {L.hero_sub}
          </p>
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 rounded-full bg-amber-brand text-[color:var(--forest)] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
          >
            {L.hero_cta}
          </a>
        </div>
      </section>

      {/* 2. Why now */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.2em] text-[color:var(--forest)]/70 font-medium mb-3 text-center">
          {L.why_eyebrow}
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-10 leading-tight">
          {L.why_title}
        </h2>
        <div className="space-y-5 text-base sm:text-lg text-foreground/80 leading-relaxed">
          {L.why_body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="mt-8 text-xs tracking-wide text-foreground/55 text-center">
          {L.why_sources}
        </p>
      </section>

      {/* 3. What is Bura */}
      <section className="bg-[color:var(--sage)]/40">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <p className="text-xs tracking-[0.2em] text-[color:var(--forest)]/70 font-medium mb-3 text-center">
            {L.what_eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-10 leading-tight">
            {L.what_title}
          </h2>
          <div className="space-y-5 text-base sm:text-lg text-foreground/80 leading-relaxed mb-12">
            {L.what_body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {L.what_stats.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl bg-background p-5 text-center shadow-sm border border-[color:var(--forest)]/10"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[color:var(--sage)] text-[color:var(--forest)] mb-3">
                  <TrendingUp size={18} />
                </div>
                <div className="text-base font-semibold text-[color:var(--forest)] mb-1">
                  {s.source}
                </div>
                <div className="text-xs tracking-wide text-foreground/65">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 4. Who can help - 2x2 grid */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.2em] text-[color:var(--forest)]/70 font-medium mb-3 text-center">
          {L.who_eyebrow}
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-10">
          {L.who_title}
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {L.who_cards.map((c, i) => {
            const Icon = c.Icon ?? placeholderIcon;
            return (
              <div
                key={i}
                className="rounded-2xl bg-card p-7 border border-[color:var(--forest)]/10 hover:shadow-md transition flex flex-col"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[color:var(--sage)] text-[color:var(--forest)] mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-2 text-[color:var(--forest)]">{c.title}</h3>
                <p className="text-[15px] text-foreground/75 leading-relaxed mb-6">{c.body}</p>
                <button
                  type="button"
                  onClick={() => {
                    setType(c.typeValue);
                    if (typeof document !== "undefined") {
                      document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="mt-auto self-start inline-flex items-center gap-2 rounded-full bg-amber-brand text-[color:var(--forest)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
                >
                  {c.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Contact form */}
      <section id="kontakt" className="bg-[color:var(--warm)]">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <p className="text-xs tracking-[0.2em] text-[color:var(--forest)]/70 font-medium mb-3 text-center">
            {L.form_eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-3">
            {L.form_title}
          </h2>
          <p className="text-center text-foreground/70 mb-10">{L.form_sub}</p>

          {done ? (
            <div className="rounded-2xl bg-[color:var(--sage)] p-8 text-center border border-[color:var(--forest)]/15">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-background text-[color:var(--forest)] mb-4">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">{L.form_done_title}</h3>
              <p className="text-foreground/75">{L.form_done_body}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5 bg-background rounded-2xl p-6 sm:p-8 border border-[color:var(--forest)]/10 shadow-sm">
              <Field label={L.form_name}>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-[color:var(--forest)]/15 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-brand"
                />
              </Field>
              <Field label={L.form_email}>
                <input
                  type="email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[color:var(--forest)]/15 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-brand"
                />
              </Field>
              <Field label={L.form_type}>
                <select
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-lg border border-[color:var(--forest)]/15 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-brand"
                >
                  <option value="" disabled>
                    {L.form_type_placeholder}
                  </option>
                  {L.form_type_options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={L.form_message}>
                <textarea
                  maxLength={2000}
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg border border-[color:var(--forest)]/15 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-brand resize-none"
                />
              </Field>

              {err && <p className="text-sm text-destructive">{err}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--forest)] text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> {L.form_sending}
                  </>
                ) : (
                  L.form_cta
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 6. Footer quote */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <Users size={28} className="mx-auto mb-5 text-[color:var(--amber-brand)]" />
        <p className="text-xl sm:text-2xl italic text-[color:var(--forest)] leading-relaxed">
          {L.quote}
        </p>
        {L.quote_attrib && (
          <p className="mt-4 text-sm tracking-wide text-foreground/60 uppercase">{L.quote_attrib}</p>
        )}
      </section>

      {/* Site footer */}
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
        <p className="text-center text-xs text-white/60 mt-4">
          <Link to={altPath} className="hover:text-amber-brand transition">
            {lang === "bs" ? "English" : "Bosanski"}
          </Link>
        </p>
      </footer>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-[0.18em] font-semibold text-foreground/65 mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
