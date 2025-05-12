import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import { common as commonEn } from "./locales/en/common";
import { auth as authEn } from "./locales/en/auth";
import { events as eventsEn } from "./locales/en/events";
import { admin as adminEn } from "./locales/en/admin";

import { common as commonAr } from "./locales/ar/common";
import { auth as authAr } from "./locales/ar/auth";
import { events as eventsAr } from "./locales/ar/events";
import { admin as adminAr } from "./locales/ar/admin";

const resources = {
  en: {
    common: commonEn,
    auth: authEn,
    events: eventsEn,
    admin: adminEn,
  },
  ar: {
    common: commonAr,
    auth: authAr,
    events: eventsAr,
    admin: adminAr,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  supportedLngs: ["en", "ar"],
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  ns: ["common", "auth", "events", "admin"],
  defaultNS: "common",
});

export default i18n;
