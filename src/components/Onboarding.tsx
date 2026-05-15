import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Buri } from "./Buri";
import { WindMark } from "./WindMark";
import { type Children, type Heating, type Lang, type Profile, t } from "@/lib/i18n";

type Props = { lang: Lang; onDone: (p: Profile) => void; onHome?: () => void };

type Step = "city" | "children" | "heating";

export function Onboarding({ lang, onDone, onHome }: Props) {
  const tr = t(lang);
  const [step, setStep] = useState<Step>("city");
  const [city, setCity] = useState("");
  const [children, setChildren] = useState<Children | null>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSug, setLoadingSug] = useState(false);

  useEffect(() => {
    const q = city.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setLoadingSug(false);
      return;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setLoadingSug(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=ba&accept-language=${lang}&limit=6&featureType=city&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, { signal: ctrl.signal, headers: { "Accept": "application/json" } });
        const data: Array<{ display_name: string; name?: string; type?: string }> = await res.json();
        const seen = new Set<string>();
        const names: string[] = [];
        for (const d of data) {
          const n = (d.name || d.display_name.split(",")[0] || "").trim();
          if (n && !seen.has(n.toLowerCase())) {
            seen.add(n.toLowerCase());
            names.push(n);
          }
        }
        setSuggestions(names.slice(0, 5));
      } catch (e) {
        if ((e as Error).name !== "AbortError") setSuggestions([]);
      } finally {
        setLoadingSug(false);
      }
    }, 300);
    return () => { ctrl.abort(); clearTimeout(timer); };
  }, [city, lang]);

  const goChildren = (chosen?: string) => {
    const value = (chosen ?? city).trim();
    if (!value) return;
    setCity(value);
    setStep("children");
  };

  const pickChildren = (c: Children) => {
    setChildren(c);
    setStep("heating");
  };

  const finish = (h: Heating) => {
    if (!city.trim() || !children) return;
    onDone({ city: city.trim(), children, heating: h });
  };

  const L = lang === "bs"
    ? {
        cityTitle: "Koji je tvoj grad?",
        citySub: "Reci nam gdje živiš, pokazat ćemo ti kakav je danas zrak.",
        cityPh: "Npr. Sarajevo, Zenica, Tuzla",
        cityCta: "Dalje",
        cityBubble: "Ćao! Reci mi gdje živiš.",
        kidsTitle: "Imate li djecu?",
        kidsSub: "Savjeti će biti prilagođeni vašoj porodici.",
        kidsBubble: "Za koga brinemo danas?",
        heatTitle: "Čime grijete dom?",
        heatSub: "Pomaže nam da razumijemo izvor zagađenja.",
        heatBubble: "Skoro gotovo!",
        back: "Nazad",
      }
    : {
        cityTitle: "What's your city?",
        citySub: "Tell us where you live, we'll show you today's air.",
        cityPh: "e.g. Sarajevo, Zenica, Tuzla",
        cityCta: "Next",
        cityBubble: "Hi! Tell me where you live.",
        kidsTitle: "Do you have children?",
        kidsSub: "We'll tailor advice for your family.",
        kidsBubble: "Who are we caring for today?",
        heatTitle: "How do you heat your home?",
        heatSub: "It helps us understand the source of pollution.",
        heatBubble: "Almost done!",
        back: "Back",
      };

  const childrenOpts: Children[] = ["young", "older", "none"];
  const heatingOpts: Heating[] = ["coal", "gas", "district", "unsure"];

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-6 flex items-center gap-2 max-w-6xl mx-auto">
        <button
          onClick={onHome}
          className="flex items-center gap-2 hover:opacity-75 transition"
          aria-label="Bura, home"
        >
          <span className="font-bold text-xl tracking-tight">{tr.brand}</span>
          <WindMark size={20} color="var(--forest)" />
        </button>
      </header>

      <main className="px-6 max-w-md mx-auto pt-8 pb-24 text-center">
        <div
          className="rounded-3xl p-8 flex items-center justify-center mx-auto"
          style={{ background: "var(--forest)" }}
        >
          <Buri
            pm25={8}
            lang={lang}
            bubbleText={step === "city" ? L.cityBubble : step === "children" ? L.kidsBubble : L.heatBubble}
            captionText=""
          />
        </div>

        {step === "city" && (
          <>
            <h1 className="mt-10 font-bold text-3xl sm:text-4xl leading-tight tracking-tight">{L.cityTitle}</h1>
            <p className="mt-3 text-base text-muted-foreground">{L.citySub}</p>
            <form onSubmit={(e) => { e.preventDefault(); goChildren(); }} className="mt-8 text-left">
              <div className="flex items-center gap-2 bg-card border border-input rounded-full px-5 py-4 focus-within:border-foreground/40 transition">
                <Search size={18} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value.slice(0, 80))}
                  placeholder={L.cityPh}
                  autoFocus
                  className="flex-1 bg-transparent text-base focus:outline-none"
                />
              </div>

              {loadingSug && city.trim().length >= 2 && suggestions.length === 0 && (
                <p className="mt-3 text-xs text-muted-foreground">…</p>
              )}

              {suggestions.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => { setCity(s); goChildren(s); }}
                        className="px-3 py-1.5 text-sm rounded-full border border-input bg-card hover:border-foreground/40 transition"
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
                {L.cityCta} →
              </button>
            </form>
          </>
        )}

        {step === "children" && (
          <>
            <h1 className="mt-10 font-bold text-3xl sm:text-4xl leading-tight tracking-tight">{L.kidsTitle}</h1>
            <p className="mt-3 text-base text-muted-foreground">{L.kidsSub}</p>
            <div className="mt-8 flex flex-col gap-3 text-left">
              {childrenOpts.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => pickChildren(c)}
                  className="w-full px-5 py-4 rounded-2xl border border-input bg-card hover:border-foreground/40 transition text-base font-medium"
                >
                  {tr.ob_children[c]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep("city")}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground transition"
            >
              ← {L.back}
            </button>
          </>
        )}

        {step === "heating" && (
          <>
            <h1 className="mt-10 font-bold text-3xl sm:text-4xl leading-tight tracking-tight">{L.heatTitle}</h1>
            <p className="mt-3 text-base text-muted-foreground">{L.heatSub}</p>
            <div className="mt-8 flex flex-col gap-3 text-left">
              {heatingOpts.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => finish(h)}
                  className="w-full px-5 py-4 rounded-2xl border border-input bg-card hover:border-foreground/40 transition text-base font-medium"
                >
                  {tr.ob_heating[h]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep("children")}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground transition"
            >
              ← {L.back}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
