import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Onboarding } from "@/components/Onboarding";
import { MainPage } from "@/components/MainPage";
import { Landing } from "@/components/Landing";
import type { Profile } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bura · Kvalitet zraka u BiH — znaj šta dišeš" },
      {
        name: "description",
        content:
          "Kvalitet zraka u Sarajevu, Zenici, Tuzli, Mostaru i Banja Luci uživo. PM2.5, AQI i personalizovani jutarnji savjeti za porodice u BiH.",
      },
      { property: "og:title", content: "Bura · Kvalitet zraka u BiH" },
      {
        property: "og:description",
        content:
          "Kvalitet zraka uživo za gradove u BiH. Personalizovani jutarnji savjeti za roditelje.",
      },
    ],
  }),
  component: Home,
});

const KEY = "bura.profile.v1";
const SKEY = "bura.started.v1";

function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lang, setLang] = useLang();
  const [started, setStarted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Always start on the landing page when the link is opened.
    try {
      sessionStorage.removeItem(SKEY);
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

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
