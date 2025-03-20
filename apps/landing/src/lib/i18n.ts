import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '@/i18n/locales/en'
import vi from '@/i18n/locales/vi'

export const defaultNS = 'common'
export const resources = {
  en: {
    ...en,
  },
  vi: {
    ...vi,
  },
} as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

export type I18nNamespaces = keyof typeof resources.en
export type I18nKeys<NS extends I18nNamespaces> = keyof (typeof resources.en)[NS]
