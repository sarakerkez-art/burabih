import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Buri } from "./Buri";
import { WindMark } from "./WindMark";
import { cities, type Lang, type Profile, t } from "@/lib/i18n";

type Props = { lang: Lang; onDone: (p: Profile) => void; onHome?: () => void };

export function Onboarding({ lang, onDone, onHome }: Props) {
  const tr = t(lang);
  const [city, setCity] = useState("");

  const suggestions = useMemo(() => {
    const q = city.trim().toLowerCase();
    if (!q) return [];
    return cities.filter((c) => c.toLowerCase().includes(q) && c.toLowerCase() !== q).slice(0, 5);
  }, [city]);

  const finish = (chosen?: string) => {
    const value = (chosen ?? city).trim();
    if (!value) return;
    onDone({ city: value, children: "none", heating: "unsure" });
  };

  const L = lang === "bs"
    ? {
        title: "Koji je tvoj grad?",
        sub: "Reci nam gdje živiš — pokazat ćemo ti kakav je danas zrak.",
        placeholder: "Npr. Sarajevo, Zenica, Tuzla…",
        cta: "Vidi zrak",
        bubble: "Ćao! Reci mi gdje živiš.",
      }
    : {
        title: "What's your city?",
        sub: "Tell us where you live — we'll show you today's air.",
        placeholder: "e.g. Sarajevo, Zenica, Tuzla…",
        cta: "See the air",
        bubble: "Hi! Tell me where you live.",
      };

  return (
    <div className="min-h-screen bg-[color:var(--teal-brand)] text-white">
      <header className="px-6 py-6 flex items-center gap-2 max-w-6xl mx-auto">
        <button
          onClick={onHome}
          className="flex items-center gap-2 hover:opacity-75 transition"
          aria-label="Bura, home"
        >
          <span className="font-bold text-xl tracking-tight text-white">{tr.brand}</span>
          <WindMark size={20} color="white" />
        </button>
      </header>

      <main className="px-6 max-w-md mx-auto pt-8 pb-24 text-center">
        <div className="flex items-center justify-center">
          <Buri pm25={8} lang={lang} bubbleText={L.bubble} captionText="" />
        </div>

        <h1 className="mt-10 font-bold text-3xl sm:text-4xl leading-tight tracking-tight text-white">
          {L.title}
        </h1>
        <p className="mt-3 text-base text-white/75">{L.sub}</p>

        <form
          onSubmit={(e) => { e.preventDefault(); finish(); }}
          className="mt-8 text-left"
        >
          <div className="flex items-center gap-2 bg-white/10 border border-white/25 rounded-full px-5 py-4 focus-within:border-white/60 transition">
            <Search size={18} className="text-white/70 shrink-0" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value.slice(0, 80))}
              placeholder={L.placeholder}
              autoFocus
              className="flex-1 bg-transparent text-base text-white placeholder:text-white/50 focus:outline-none"
              list="bura-cities"
            />
          </div>
          <datalist id="bura-cities">
            {cities.filter((c) => c !== "Drugo").map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          {suggestions.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => { setCity(s); finish(s); }}
                    className="px-3 py-1.5 text-sm rounded-full border border-white/30 bg-white/10 text-white hover:border-white/60 transition"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            disabled={!city.trim()}
            className="mt-6 w-full bg-amber-brand text-[color:var(--accent-foreground)] font-semibold py-4 rounded-full text-base transition hover:brightness-95 disabled:opacity-40"
          >
            {L.cta} →
          </button>
        </form>
      </main>
    </div>
  );
}
