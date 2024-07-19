// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import ru from './locales/ru/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },  
      ru: {
        translation: ru
      }
    },
    fallbackLng: 'ru',
    debug: true,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;