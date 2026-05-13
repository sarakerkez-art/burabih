import { Link } from "@tanstack/react-router";
import { BiHMap, type SchoolPin } from "./BiHMap";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

const PINS: SchoolPin[] = [
  { id: "sa", name: "Sarajevo", status: "", x: 55, y: 60, color: "green" },
  { id: "ze", name: "Zenica", status: "", x: 48, y: 48, color: "green" },
  { id: "tu", name: "Tuzla", status: "", x: 62, y: 38, color: "green" },
];

export function SchoolsTeaser({ lang }: { lang: Lang }) {
  const tr = t(lang);
  return (
    <section className="bg-white px-5 sm:px-8 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-amber-brand font-semibold">
          {tr.schools_teaser_label}
        </p>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
          {tr.schools_teaser_title}
        </h2>
        <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
          {tr.schools_teaser_sub}
        </p>

        <div className="mt-10">
          <BiHMap pins={PINS} showTooltips={false} />
        </div>

        <p className="mt-8 text-sm text-amber-brand font-medium">
          {tr.schools_teaser_amber}
        </p>

        <Link
          to="/skole"
          className="mt-6 inline-block bg-amber-brand text-[color:var(--accent-foreground)] font-semibold px-7 py-3.5 rounded-full text-sm hover:brightness-95 transition"
        >
          {tr.schools_teaser_cta}
        </Link>
      </div>
    </section>
  );
}
