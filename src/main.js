import Vue from 'vue';
import VueWorker from "vue-worker";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import webworkerActions from './webworker.actions';
import store, { STORE_KEYS } from './sharedservice';

Vue.use(ElementUI);
Vue.use(VueWorker);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
  created() {
    store.setItem(STORE_KEYS.WORKER, this.$worker.create(webworkerActions));
  }
}).$mount('#app')