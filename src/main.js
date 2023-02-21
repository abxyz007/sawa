import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import store from "./store";
import router from "./router";
import http from "./utils/http";
import './plugins/vee-validate';
import VueMoment from 'vue-moment'
import configuration from './configurations';
import VueMask from 'vue-the-mask';

import can from './mixins/can';
import i18n from './plugins/118n/i18n';

import './configurations/filters'
import './assets/style/style.scss';

Vue.use(VueMoment);
Vue.use(configuration);
Vue.use(VueMask);

Vue.mixin({
  computed: {
    console: () => console
  }
})

Vue.config.productionTip = false;
Vue.prototype.$http = http;
Vue.mixin({
  methods: {
    can
  }
});

new Vue({
  vuetify,
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app');
