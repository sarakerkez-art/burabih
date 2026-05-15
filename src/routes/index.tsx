import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Onboarding } from "@/components/Onboarding";
import { MainPage } from "@/components/MainPage";
import { Landing } from "@/components/Landing";
import type { Lang, Profile } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bura: Znaj šta dišeš" },
      {
        name: "description",
        content:
          "Bura je lični ekološki asistent za roditelje u BiH. Svako jutro vam kaže šta vaša djeca dišu, i šta možete učiniti.",
      },
      { property: "og:title", content: "Bura: Znaj šta dišeš" },
      {
        property: "og:description",
        content: "Personalizovani jutarnji savjeti za roditelje u Sarajevu, Zenici i Tuzli.",
      },
    ],
  }),
  component: Home,
});

const KEY = "bura.profile.v1";
const LKEY = "bura.lang.v1";
const SKEY = "bura.started.v1";

function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lang, setLang] = useState<Lang>("bs");
  const [started, setStarted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Always start on the landing page when the link is opened.
    try {
      sessionStorage.removeItem(SKEY);
      const l = localStorage.getItem(LKEY) as Lang | null;
      if (l === "bs" || l === "en") setLang(l);
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem(LKEY, lang); }, [lang, hydrated]);

  const handleDone = (p: Profile) => {
    setProfile(p);
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
  };

  const handleOpen = () => {
    setProfile(null);
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    setStarted(true);
    try { sessionStorage.setItem(SKEY, "1"); } catch { /* ignore */ }
  };

  const handleHome = () => {
    setStarted(false);
    try { sessionStorage.removeItem(SKEY); } catch { /* ignore */ }
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!hydrated) return <div className="min-h-screen bg-background" />;
  if (!started) return <Landing lang={lang} setLang={setLang} onOpen={handleOpen} />;
  if (!profile) return <Onboarding lang={lang} onDone={handleDone} onHome={handleHome} />;

  return (
    <MainPage
      profile={profile}
      lang={lang}
      setLang={setLang}
      onEditProfile={() => setProfile(null)}
      onHome={handleHome}
    />
  );
}
