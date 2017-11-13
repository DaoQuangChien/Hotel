// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import VueI18n from 'vue-i18n'
import locales from './locales'

Vue.config.productionTip = false
Vue.use(Quasar) // Install Quasar Framework
Vue.use(VueMaterial)
Vue.use(VueI18n)

Vue.config.lang = locales.fallbackLang
Vue.config.fallbackLang = locales.fallbackLang
// set locales
console.log(locales.messages)
Object.keys(locales.messages).forEach(function (lang) {
  Vue.locale(lang, locales.messages[lang])
})

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
import 'vue-material/dist/vue-material.css'
import 'quasar-extras/fontawesome'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/animate/bounceInLeft.css'
// import 'quasar-extras/animate/bounceOutRight.css'

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store,
    render: h => h(require('./App').default)
  })
})
