import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import type { Lang } from "@/lib/i18n";

type Item = { label: string; to?: string; onClick?: () => void };

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  items: Item[];
};

export function MobileNav({ lang, setLang, items }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="p-2 -mr-2 text-foreground hover:text-amber-brand transition"
      >
        <Menu size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="px-6 py-6 flex items-center justify-end">
            <button
              onClick={close}
              aria-label="Close menu"
              className="p-2 -mr-2 text-foreground hover:text-amber-brand transition"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-6 -mt-12">
            {items.map((it, i) =>
              it.to ? (
                <Link
                  key={i}
                  to={it.to}
                  onClick={close}
                  className="text-2xl font-semibold tracking-tight text-foreground hover:text-amber-brand transition"
                >
                  {it.label}
                </Link>
              ) : (
                <button
                  key={i}
                  onClick={() => {
                    close();
                    it.onClick?.();
                  }}
                  className="text-2xl font-semibold tracking-tight text-foreground hover:text-amber-brand transition"
                >
                  {it.label}
                </button>
              ),
            )}
            <div className="mt-6 flex items-center gap-3 text-sm tracking-wide">
              <button
                onClick={() => setLang("bs")}
                className={`hover:text-amber-brand transition ${lang === "bs" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
              >
                BHS
              </button>
              <span className="text-muted-foreground">·</span>
              <button
                onClick={() => setLang("en")}
                className={`hover:text-amber-brand transition ${lang === "en" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
