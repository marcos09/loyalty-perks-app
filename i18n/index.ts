import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";

const resources = {
  es: {
    translation: es,
  },
  en: {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es",
  fallbackLng: "es",
  debug: __DEV__,

  interpolation: {
    escapeValue: false,
  },

  detection: {
    order: ["localStorage", "navigator", "htmlTag"],
    caches: ["localStorage"],
  },
});

const deviceLocale = Localization.getLocales()[0]?.languageCode;
if (deviceLocale && resources[deviceLocale as keyof typeof resources]) {
  i18n.changeLanguage(deviceLocale);
}

export default i18n;
