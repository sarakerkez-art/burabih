import { useState } from "react";
import { WindMark } from "./WindMark";
import { cities, type Children, type Heating, type Lang, type Profile, t } from "@/lib/i18n";

type Props = { lang: Lang; onDone: (p: Profile) => void; onHome?: () => void };

export function Onboarding({ lang, onDone, onHome }: Props) {
  const tr = t(lang);
  const [step, setStep] = useState(0);
  const [city, setCity] = useState<string>("");
  const [children, setChildren] = useState<Children | "">("");
  const [heating, setHeating] = useState<Heating | "">("");

  const canNext =
    (step === 0 && city) ||
    (step === 1 && children) ||
    (step === 2 && heating);

  const finish = () => {
    if (city && children && heating) {
      onDone({ city, children, heating });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-6 flex items-center gap-2">
        <button
          onClick={onHome}
          className="flex items-center gap-2 hover:opacity-75 transition"
          aria-label="Bura, home"
        >
          <span className="font-bold text-xl tracking-tight">{tr.brand}</span>
          <WindMark size={20} color="var(--forest)" />
        </button>
      </header>

      <main className="px-6 max-w-xl mx-auto pt-6 pb-24">
        <h1 className="font-bold text-3xl sm:text-4xl leading-[1.1] tracking-tight">
          {tr.ob_title}
        </h1>
        <p className="mt-3 text-base text-muted-foreground max-w-md">{tr.ob_sub}</p>

        <div key={step} className="mt-12 fade-up">
          {step === 0 && (
            <div>
              <label className="block text-sm font-medium mb-3">{tr.ob_q1}</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-card border border-input rounded-lg px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">{tr.ob_select_city}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium mb-3">{tr.ob_q2}</label>
              <div className="flex flex-col gap-3">
                {(["young", "older", "none"] as Children[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setChildren(c)}
                    className={`px-5 py-4 rounded-full text-left text-base transition border ${
                      children === c
                        ? "bg-foreground text-background border-foreground"
                        : "bg-card border-input hover:border-foreground/40"
                    }`}
                  >
                    {tr.ob_children[c]}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <label className="block text-sm font-medium mb-3">{tr.ob_q3}</label>
              <div className="flex flex-col gap-3">
                {(["coal", "gas", "district", "unsure"] as Heating[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => setHeating(h)}
                    className={`px-5 py-4 rounded-full text-left text-base transition border ${
                      heating === h
                        ? "bg-foreground text-background border-foreground"
                        : "bg-card border-input hover:border-foreground/40"
                    }`}
                  >
                    {tr.ob_heating[h]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="text-sm text-muted-foreground hover:text-foreground transition disabled:opacity-30"
            disabled={step === 0}
          >
            ← {tr.back}
          </button>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition ${
                  i <= step ? "bg-foreground" : "bg-foreground/15"
                }`}
              />
            ))}
          </div>
          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="text-sm font-medium text-foreground disabled:opacity-30"
            >
              {tr.next} →
            </button>
          ) : (
            <span className="w-12" />
          )}
        </div>

        {step === 2 && (
          <div className="mt-12 fade-up">
            <button
              onClick={finish}
              disabled={!heating}
              className="w-full bg-amber-brand text-[color:var(--accent-foreground)] font-semibold py-4 rounded-full text-base transition hover:brightness-95 disabled:opacity-40"
            >
              {tr.ob_cta}
            </button>
            <p className="text-xs text-muted-foreground mt-4 text-center">{tr.ob_note}</p>
          </div>
        )}
      </main>
    </div>
  );
}
