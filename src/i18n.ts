import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import * as langsResources from './langs/translation';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: langsResources,
    debug: build.DEV,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });