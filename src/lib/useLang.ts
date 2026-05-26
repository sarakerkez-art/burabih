import { useCallback, useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

const LKEY = "bura.lang.v1";

function readStored(): Lang {
  if (typeof window === "undefined") return "bs";
  try {
    const v = localStorage.getItem(LKEY);
    return v === "en" ? "en" : "bs";
  } catch {
    return "bs";
  }
}

/**
 * Shared language state, persisted in localStorage and synced across tabs/pages.
 * Default is Bosnian. Once the user picks EN, it stays EN across navigation.
 */
export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>("bs");

  useEffect(() => {
    setLangState(readStored());
    const onStorage = (e: StorageEvent) => {
      if (e.key === LKEY) setLangState(readStored());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LKEY, l); } catch { /* ignore */ }
  }, []);

  return [lang, setLang];
}
