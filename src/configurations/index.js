import GlobalMixin from './mixin';

export default {
  install(Vue) {
    Vue.mixin(GlobalMixin)
  }
}