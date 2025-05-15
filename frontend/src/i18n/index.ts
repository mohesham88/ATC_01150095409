import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import enAuth from "./locales/en/auth.json";
import enAdmin from "./locales/en/admin.json";
import arAuth from "./locales/ar/auth.json";
import enCommon from "./locales/en/common.json";
import arCommon from "./locales/ar/common.json";
import arEvents from "./locales/ar/events.json";
import arAdmin from "./locales/ar/admin.json";
import enEvents from "./locales/en/events.json";
const resources = {
  en: {
    auth: enAuth,
    common: enCommon,
    admin: enAdmin,
    events: enEvents,
  },
  ar: {
    auth: arAuth,
    common: arCommon,
    events: arEvents,
    admin: arAdmin,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    ns: ["auth", "common", "events", "admin"],
    defaultNS: "common",
  });

export default i18n;
