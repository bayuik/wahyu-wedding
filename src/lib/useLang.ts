import { useEffect, useState } from "react";
import { DEFAULT_LANG, dict, type Lang } from "./i18n";

/**
 * React islands render on the server with the default language, then subscribe
 * to the `lang:change` event that the page-level toggle dispatches. Reading
 * localStorage on mount covers a guest who already picked a language earlier.
 */
export function useLang(): [Lang, (key: string) => string] {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (stored === "id" || stored === "en") setLang(stored);

    const onChange = (e: Event) => {
      const next = (e as CustomEvent<{ lang: Lang }>).detail?.lang;
      if (next) setLang(next);
    };
    document.addEventListener("lang:change", onChange);
    return () => document.removeEventListener("lang:change", onChange);
  }, []);

  const t = (key: string) => dict[lang]?.[key] ?? dict[DEFAULT_LANG][key] ?? key;
  return [lang, t];
}
