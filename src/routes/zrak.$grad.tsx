import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { WindMark } from "@/components/WindMark";
import { Buri } from "@/components/Buri";
import { fetchAir, type AirSnapshot } from "@/lib/air";
import { fetchAdvice } from "@/lib/advice.functions";
import { Loader2 } from "lucide-react";

const CITY_BY_SLUG: Record<string, string> = {
  sarajevo: "Sarajevo",
  zenica: "Zenica",
  tuzla: "Tuzla",
  mostar: "Mostar",
  "banja-luka": "Banja Luka",
};

export const Route = createFileRoute("/zrak/$grad")({
  beforeLoad: ({ params }) => {
    if (!CITY_BY_SLUG[params.grad]) throw notFound();
  },
  head: ({ params }) => {
    const city = CITY_BY_SLUG[params.grad] ?? params.grad;
    const title = `Kvalitet zraka ${city} — PM2.5 uživo · Bura`;
    const desc = `Trenutni kvalitet zraka u ${city}u. PM2.5, AQI i personalizovani savjeti. Air quality ${city} live PM2.5 and AQI data.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `https://burabih.org/zrak/${params.grad}` },
        { property: "og:type", content: "article" },
      ],
      links: [
        { rel: "canonical", href: `https://burabih.org/zrak/${params.grad}` },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-bold">Grad nije pronađen</h1>
        <p className="mt-3 text-muted-foreground">
          <Link to="/" className="underline">Nazad na početnu</Link>
        </p>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-bold">Greška pri učitavanju</h1>
        <p className="mt-3 text-muted-foreground">
          <Link to="/" className="underline">Nazad na početnu</Link>
        </p>
      </div>
    </div>
  ),
  component: GradPage,
});

function GradPage() {
  const { grad } = Route.useParams();
  const city = CITY_BY_SLUG[grad]!;
  const [air, setAir] = useState<AirSnapshot | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const getAdvice = useServerFn(fetchAdvice);

  useEffect(() => {
    let alive = true;
    fetchAir(city).then((a) => alive && setAir(a));
    return () => { alive = false; };
  }, [city]);

  useEffect(() => {
    if (!air) return;
    let alive = true;
    setAiLoading(true);
    setAiText(null);
    getAdvice({
      data: {
        city,
        heating: "unsure",
        children: "young",
        pm25: air.pm25,
        temp: air.temp ?? null,
        hour: new Date().getHours(),
        lang: "bs",
      },
    })
      .then((r) => { if (alive && r.ok) setAiText(r.text); })
      .finally(() => { if (alive) setAiLoading(false); });
    return () => { alive = false; };
  }, [air, city, getAdvice]);

  const pm = air?.pm25 ?? null;
  const pmStr = pm != null ? pm.toFixed(0) : "—";
  const x = air ? air.whoMultiplier.toFixed(1) : "—";
  const aiItems = parseAdvice(aiText);

  const status =
    pm == null ? "PROVJERA ZRAKA"
    : pm < 12 ? "DOBAR ZRAK"
    : pm < 35 ? "UMJEREN ZRAK"
    : pm < 55 ? "LOŠ ZRAK"
    : "OPASAN ZRAK";

  const statusTone =
    pm == null ? "text-white/80"
    : pm < 12 ? "text-[#9ee6a8]"
    : pm < 35 ? "text-amber-brand"
    : pm < 55 ? "text-[#ffb37a]"
    : "text-[#ff8a7a]";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-5 sm:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-75 transition">
          <span className="font-bold text-xl tracking-tight">Bura</span>
          <WindMark size={20} color="var(--forest)" />
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition">
          ← Početna
        </Link>
      </header>

      <main>
        <section className="bg-[color:var(--forest)] text-white px-5 sm:px-8 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <Buri pm25={pm} lang="bs" />
            <p className="mt-8 text-xs tracking-[0.25em] font-semibold text-white/60">DANAS</p>
            <h1 className={`mt-2 text-3xl sm:text-5xl font-bold tracking-tight ${statusTone}`}>
              Kvalitet zraka {city}
            </h1>
            <p className="mt-4 text-lg sm:text-xl font-medium text-white/90">{status}</p>
            <p className="mt-6 text-base text-white/85">
              PM2.5: <span className="tabular-nums font-semibold">{pmStr}</span> µg/m³
              {pm != null && <> · <span className="tabular-nums">{x}×</span> iznad WHO granice</>}
            </p>
            {air?.temp != null && (
              <p className="mt-2 text-sm text-white/70">Temperatura: {air.temp}°C</p>
            )}
            <p className="mt-6 text-xs text-white/55">
              Izvor: aqicn.org · Federalni Hidrometeorološki Zavod BiH
            </p>
          </div>
        </section>

        <section className="px-5 sm:px-8 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Savjeti za danas, {city}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Personalizovano na osnovu trenutnog stanja zraka.
            </p>

            {aiLoading && (
              <div className="mt-8 flex items-center gap-3 text-muted-foreground">
                <Loader2 size={18} className="animate-spin text-amber-brand" />
                <span className="text-sm">Buri priprema vaše savjete...</span>
              </div>
            )}

            {!aiLoading && aiItems.length > 0 && (
              <div className="mt-8 flex flex-col gap-6">
                <div className="rounded-2xl bg-[color:var(--forest)] text-white p-6 sm:p-7">
                  <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-amber-brand">
                    PRIMARNA PREPORUKA
                  </div>
                  <p className="mt-3 text-xl sm:text-2xl font-semibold leading-snug">{aiItems[0]}</p>
                </div>
                {aiItems.length > 1 && (
                  <ul className="flex flex-col gap-3">
                    {aiItems.slice(1).map((text, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-brand shrink-0" />
                        <p className="flex-1 text-sm text-foreground/75 leading-relaxed">{text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[color:var(--warm)] px-5 sm:px-8 py-14 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Želite savjete prilagođene vašoj porodici?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Postavite svoj profil — grad, djeca, način grijanja — i dobijte personalizovane preporuke svako jutro.
            </p>
            <Link
              to="/"
              className="inline-block mt-6 rounded-full bg-[color:var(--forest)] text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition"
            >
              Postavi moj profil
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[color:var(--forest)] text-white px-5 sm:px-8 py-10 text-sm text-center">
        <div className="flex items-center justify-center gap-2 font-bold">
          Bura <WindMark size={16} color="white" />
        </div>
        <p className="mt-2 text-white/70 text-xs">Znaj šta dišeš.</p>
      </footer>
    </div>
  );
}

function parseAdvice(text: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((l) => l.replace(/^\s*\d+[.)]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}
