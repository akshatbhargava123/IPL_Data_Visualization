import Vue from 'vue';
import VueApexCharts from "vue-apexcharts";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import router from './router';
import './registerServiceWorker';

Vue.use(ElementUI);
Vue.use(VueApexCharts);

Vue.component("apexchart", VueApexCharts);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
