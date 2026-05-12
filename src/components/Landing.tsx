import { Buri } from "./Buri";
import { WindMark } from "./WindMark";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

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
        hero_eyebrow: "Lični ekološki asistent za roditelje u BiH",
        hero_title: "Znajte šta vaša djeca dišu, svako jutro.",
        hero_sub: "Bura nije još jedan dashboard. Bura je povjerljiv jutarnji saputnik koji vam za 5 sekundi kaže šta je u zraku, i šta možete učiniti danas.",
        what_title: "Šta je Bura?",
        what_p1: "Sateliti odozgo. Senzori na zemlji. Prijave komšija. Bura spaja sve u jednu jednostavnu poruku: prilagođenu vašem gradu, vašem grijanju, vašoj djeci.",
        what_p2: "Bez prijave. Bez reklama. Besplatno zauvijek.",
        story_title: "Zašto postoji Bura",
        story_eyebrow: "Priča osnivača",
        story_p1: "Zovem se Andi Andinger. Živim u Beču, ali srce mi je u Bosni. Kada sam vidio mapu zagađenja Sarajeva u januaru, znao sam: roditelji u kotlini ne trebaju još jedan grafikon. Trebaju nekog ko će im jutrom reći: ‘Danas izvedi dijete poslije 14h.’",
        story_p2: "Bura je odgovor. Mali, topao, koristan. Da nijedno dijete ne diše slijepo.",
        story_sig: "Andi Andinger, Beč",
        mission_title: "Naša misija",
        mission_p: "Bura ne optužuje. Bura čini nevidljivo vidljivim, kako bi porodice mogle donijeti odluke koje štite zdravlje njihove djece.",
        partners_title: "Partneri & podaci",
        partners_p: "Otvoreni podaci · EU Copernicus · OpenAQ · UNICEF BiH · WHO",
      }
    : {
        cta_open: "Open the app",
        cta_more: "Learn more",
        hero_eyebrow: "A personal environmental assistant for parents in BiH",
        hero_title: "Know what your children breathe, every morning.",
        hero_sub: "Bura isn't another dashboard. Bura is a trusted morning companion that tells you in 5 seconds what's in the air, and what you can do about it today.",
        what_title: "What is Bura?",
        what_p1: "Satellites above. Sensors on the ground. Reports from neighbours. Bura connects them into one simple message: tailored to your city, your heating, your children.",
        what_p2: "No login. No ads. Free forever.",
        story_title: "Why Bura exists",
        story_eyebrow: "Founder's story",
        story_p1: "I'm Andi Andinger. I live in Vienna, but my heart is in Bosnia. When I saw the pollution map of Sarajevo in January, I knew: parents in the valley don't need another chart. They need someone to tell them in the morning: 'Take the kids out after 2pm today.'",
        story_p2: "Bura is the answer. Small, warm, useful. So no child breathes blindly.",
        story_sig: "Andi Andinger, Vienna",
        mission_title: "Our mission",
        mission_p: "Bura doesn't accuse. Bura makes the invisible visible, so families can make decisions that protect their children's health.",
        partners_title: "Partners & data",
        partners_p: "Open data · EU Copernicus · OpenAQ · UNICEF BiH · WHO",
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
        <button
          onClick={() => setLang(lang === "bs" ? "en" : "bs")}
          className="text-xs tracking-wide text-muted-foreground hover:text-foreground transition"
        >
          {tr.langToggle}
        </button>
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
              bubbleText={lang === "bs" ? "Ćao! Ja sam Buri. Tvoj mali čuvar zraka." : "Hi! I'm Buri. Your little air guardian."}
              captionText={lang === "bs" ? "Hajde da vidimo kakav je danas zrak u tvom gradu." : "Let's see what the air is like in your city today."}
            />
          </div>
        </div>
      </section>

      {/* What is Bura */}
      <section id="more" className="px-6 max-w-3xl mx-auto py-20 border-t border-border">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
          {L.what_title}
        </p>
        <p className="text-2xl sm:text-3xl leading-snug font-medium">
          {L.what_p1}
        </p>
        <p className="mt-5 text-base text-muted-foreground">{L.what_p2}</p>
      </section>

      {/* Founder story */}
      <section className="px-6 py-20 border-t border-border" style={{ background: "var(--warm)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
            {L.story_eyebrow}
          </p>
          <h2 className="font-bold text-3xl sm:text-4xl tracking-tight mb-8">
            {L.story_title}
          </h2>
          <p className="text-lg leading-relaxed">{L.story_p1}</p>
          <p className="mt-5 text-lg leading-relaxed">{L.story_p2}</p>
          <p className="mt-8 text-sm text-muted-foreground">{L.story_sig}</p>
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

      {/* Final CTA */}
      <section className="px-6 py-20 text-center">
        <button
          onClick={onOpen}
          className="bg-amber-brand text-[color:var(--accent-foreground)] font-semibold px-8 py-4 rounded-full text-base transition hover:brightness-95"
        >
          {L.cta_open} →
        </button>
        <p className="mt-6 text-sm text-muted-foreground">
          {lang === "bs" ? "Svaki dah je važan. ❤️" : "Every breath matters. ❤️"}
        </p>
      </section>
    </div>
  );
}
