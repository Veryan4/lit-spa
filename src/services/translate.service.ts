const LANGUAGE_KEY = "lit-spa-lang";
const NO_SCOPE_KEY = "lit-spa-no-scope";
const LANGUAGE_CHANGE_EVENT = "lit-spa-lang-update";
const TRANSLATION_LOADED_EVENT = "lit-spa-i18n-loaded";

export const translateService = {
  useLanguage,
  translate,
  formatNumber,
  formatDate,
  initLanguage,
  loadTranslations,
  getLanguage,
  NO_SCOPE_KEY,
  LANGUAGE_CHANGE_EVENT,
  TRANSLATION_LOADED_EVENT,
};

const translationCache: any = {};

async function useLanguage(lang: string): Promise<any> {
  const currentLang = getLanguage();
  if (currentLang === lang) return;
  if (!translationCache[lang]) {
    translationCache[lang] = {};
  }
  setLanguage(lang);
  window.dispatchEvent(
    new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: { lang } })
  );
}

async function loadTranslations(lang: string, scope?: string) {
  const translationCacheKey = lang + (scope ? scope : NO_SCOPE_KEY);
  if (!translationCache[lang][translationCacheKey]) {
    translationCache[lang][translationCacheKey] = await fetch(
      `/i18n/${scope ? scope + "/" : ""}${lang}.json`
    ).then((res) => res.json());
  }
  if (translationCache[lang][translationCacheKey]) {
    window.dispatchEvent(
      new CustomEvent(TRANSLATION_LOADED_EVENT, {
        detail: {
          lang,
          scope,
          translations: toTranslationMap(
            translationCache[lang][translationCacheKey]
          ),
          translationCacheKey,
        },
      })
    );
  }
}

function toTranslationMap(obj: Record<string, any>): Map<string, string> {
  function walk(
    into: Map<string, string>,
    obj: Record<string, any>,
    prefix: string[] = []
  ) {
    Object.entries(obj).forEach(([key, val]) => {
      if (typeof val === "object") walk(into, val, [...prefix, key]);
      else into.set([...prefix, key].join("."), val);
    });
  }
  const out = new Map<string, string>();
  walk(out, obj);
  return out;
}

function initLanguage(): string {
  const lang = localStorage.getItem(LANGUAGE_KEY);
  if (lang) {
    translationCache[lang] = {};
    return lang;
  }
  if (navigator.language) {
    const browserLang = navigator.language.substring(0, 2);
    translationCache[browserLang] = {};
    return browserLang;
  }
  translationCache["en"] = {};
  return "en";
}

function setLanguage(lang: string): void {
  if (!lang) {
    return;
  }
  localStorage.removeItem(LANGUAGE_KEY);
  localStorage.setItem(LANGUAGE_KEY, lang);
}

function getLanguage(): string {
  const lang = localStorage.getItem(LANGUAGE_KEY);
  return lang ? lang : "en";
}

function translate(
  record: string,
  translations: Map<string, string>,
  placeholders?: Record<string, string | number>
): string {
  const cleaned = record.replaceAll(":", ".");
  const value = translations.get(cleaned);
  if (!value) return record;
  if (!placeholders) return value;
  return value.replace(/{\w+}/g, (all: string) => {
    all = all.substring(1).slice(0, -1);
    return (placeholders[all] as any) || all;
  });
}

function formatNumber(number: number, language: string, options?: Intl.NumberFormatOptions): string {
  if (!options) return new Intl.NumberFormat(language).format(number);
  return new Intl.NumberFormat(language, options).format(number);
}

function formatDate(date: Date, language: string, options?: Intl.DateTimeFormatOptions): string {
  if (!options) return date.toLocaleDateString(language);
  return date.toLocaleDateString(language, options);
}
