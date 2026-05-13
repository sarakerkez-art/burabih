import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wind, BookOpen, Users, Map as MapIcon, Github } from "lucide-react";
import { z } from "zod";
import { WindMark } from "@/components/WindMark";
import { BiHMap, type SchoolPin } from "@/components/BiHMap";
import { type Lang, t } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/skole")({
  head: () => ({
    meta: [
      { title: "Bura · Škole koje predvode promjenu" },
      {
        name: "description",
        content:
          "Škole u BiH koje rade na čistijem zraku, instaliraju senzore, podučavaju djecu, dijele rezultate sa zajednicom.",
      },
      { property: "og:title", content: "Bura · Škole koje predvode promjenu" },
      {
        property: "og:description",
        content: "Pridružite svoju školu Bura mreži za čišći zrak u BiH.",
      },
    ],
  }),
  component: SkolePage,
});

const LKEY = "bura.lang.v1";

function SkolePage() {
  const [lang, setLang] = useState<Lang>("bs");

  useEffect(() => {
    try {
      const l = localStorage.getItem(LKEY) as Lang | null;
      if (l === "bs" || l === "en") setLang(l);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LKEY, lang); } catch { /* ignore */ }
  }, [lang]);

  const tr = t(lang);

  const pins: SchoolPin[] = [
    {
      id: "sa", lat: 43.8563, lng: 18.4131, color: "green",
      name: tr.schools_pin_sa, status: tr.schools_status_interested,
      href: "#join", moreLabel: tr.schools_more_info,
    },
    {
      id: "ze", lat: 44.2039, lng: 17.9077, color: "green",
      name: tr.schools_pin_ze, status: tr.schools_status_interested,
      href: "#join", moreLabel: tr.schools_more_info,
    },
    {
      id: "tu", lat: 44.5384, lng: 18.6739, color: "green",
      name: tr.schools_pin_tu, status: tr.schools_status_interested,
      href: "#join", moreLabel: tr.schools_more_info,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-5 sm:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-75 transition" aria-label="Bura, home">
          <span className="font-bold text-xl tracking-tight">{tr.brand}</span>
          <WindMark size={20} color="var(--forest)" />
        </Link>
        <button
          onClick={() => setLang(lang === "bs" ? "en" : "bs")}
          className="text-sm font-medium tracking-wide hover:text-accent transition"
        >
          {lang === "bs" ? "BHS · EN" : "EN · BHS"}
        </button>
      </header>

      {/* Hero */}
      <section className="bg-[color:var(--teal-brand)] text-white px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            {tr.schools_hero_title}
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-amber-brand">
            {tr.schools_hero_sub}
          </p>
          <p className="mt-8 text-base text-white/90 leading-relaxed">
            {tr.schools_hero_body}
          </p>
        </div>
      </section>

      {/* Map */}
      <section className="bg-white px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
            {tr.schools_map_title}
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-foreground/80">
            <LegendDot color="#3FAE5A" label={tr.schools_legend_active} />
            <LegendDot color="var(--amber-brand)" label={tr.schools_legend_dev} />
            <LegendDot color="#3D7AB5" label={tr.schools_legend_interested} />
          </div>

          <div className="mt-8">
            <BiHMap pins={pins} />
          </div>

          <p className="mt-6 text-center text-xs italic text-muted-foreground">
            {tr.schools_map_disclaimer}
          </p>
        </div>
      </section>

      {/* What schools do */}
      <section className="bg-[color:var(--offwhite)] px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
            {tr.schools_what_title}
          </h2>
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            <WhatItem icon={<Wind size={22} />} title={tr.schools_what_a_t} text={tr.schools_what_a_p} />
            <WhatItem icon={<BookOpen size={22} />} title={tr.schools_what_b_t} text={tr.schools_what_b_p} />
            <WhatItem icon={<Users size={22} />} title={tr.schools_what_c_t} text={tr.schools_what_c_p} />
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="bg-white px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{tr.schools_stories_title}</h2>
          <p className="mt-6 text-base text-foreground/80 leading-relaxed">
            {tr.schools_stories_body}
          </p>
          <a
            href="#join"
            className="mt-8 inline-block bg-amber-brand text-[color:var(--accent-foreground)] font-semibold px-7 py-3.5 rounded-full text-sm hover:brightness-95 transition"
          >
            {tr.schools_stories_cta}
          </a>
        </div>
      </section>

      {/* Join */}
      <section id="join" className="bg-[color:var(--forest)] text-white px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{tr.schools_join_title}</h2>
          <p className="mt-3 text-amber-brand">{tr.schools_join_sub}</p>

          <div className="mt-10 grid sm:grid-cols-3 gap-8">
            <JoinItem icon={<Wind size={22} />} title={tr.schools_join_a_t} text={tr.schools_join_a_p} />
            <JoinItem icon={<BookOpen size={22} />} title={tr.schools_join_b_t} text={tr.schools_join_b_p} />
            <JoinItem icon={<MapIcon size={22} />} title={tr.schools_join_c_t} text={tr.schools_join_c_p} />
          </div>

          <SchoolForm lang={lang} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[color:var(--forest)] text-white px-5 sm:px-8 py-14 border-t border-white/10">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-10 text-sm">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg">
              {tr.brand} <WindMark size={18} color="white" />
            </div>
            <p className="mt-3 text-white/70">{tr.foot_tag}</p>
          </div>
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
        <p className="mt-10 text-center text-amber-brand text-sm">{tr.foot_bottom} ❤</p>
      </footer>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="w-3 h-3 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function WhatItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div>
      <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center text-[color:var(--forest)]">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function JoinItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div>
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-amber-brand">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-lg text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/75 leading-relaxed">{text}</p>
    </div>
  );
}

function Story({ label, title, text, disclaimer }: { label: string; title: string; text: string; disclaimer: string }) {
  return (
    <div className="border-l-2 border-[color:var(--amber-brand)] pl-4">
      <div className="text-[11px] uppercase tracking-wide text-amber-brand font-semibold">{label}</div>
      <h3 className="mt-2 font-bold leading-snug">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
      <p className="mt-3 text-xs italic text-muted-foreground/80">{disclaimer}</p>
    </div>
  );
}

const schoolFormSchema = z.object({
  school_name: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  contact_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
});

function SchoolForm({ lang }: { lang: Lang }) {
  const tr = t(lang);
  const [form, setForm] = useState({ school_name: "", city: "", contact_name: "", email: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    supabase.rpc("schools_count").then(({ data }) => {
      if (typeof data === "number") setCount(data);
    });
  }, [done]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schoolFormSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);
    const { error: insErr } = await supabase.from("schools").insert(parsed.data);
    setSubmitting(false);
    if (insErr) {
      setError(insErr.message);
      return;
    }
    setDone(true);
  };

  return (
    <div id="form" className="mt-12">
      {done ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-[color:var(--forest)] font-semibold text-lg">{tr.schools_form_done}</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 grid gap-4 text-[color:var(--forest)]">
          <Field label={tr.schools_form_school} value={form.school_name} onChange={(v) => setForm({ ...form, school_name: v })} />
          <Field label={tr.schools_form_city} value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <Field label={tr.schools_form_contact} value={form.contact_name} onChange={(v) => setForm({ ...form, contact_name: v })} />
          <Field label={tr.schools_form_email} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-amber-brand text-[color:var(--accent-foreground)] font-semibold px-6 py-3 rounded-full text-sm hover:brightness-95 transition disabled:opacity-60"
          >
            {tr.schools_form_cta}
          </button>
        </form>
      )}
      <p className="mt-4 text-xs italic text-white/60 text-center">
        {tr.schools_form_count(count)}
      </p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground">{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-white border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground"
      />
    </label>
  );
}
