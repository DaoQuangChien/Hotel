function loadLocale (lang) {
  return () => System.import(`./${lang}.json`)
}

const messages = {
  vi: loadLocale('vi'),
  en: loadLocale('en')
}
const fallbackLang = 'vi'

export default {
  messages,
  fallbackLang
}
