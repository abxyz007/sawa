import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from './messages/index'

Vue.use(VueI18n)

export default new VueI18n({
  messages,
  fallbackLocale: 'uz',
  locale: localStorage.getItem('lang') || 'ru',
  silentTranslationWarn: true
})
