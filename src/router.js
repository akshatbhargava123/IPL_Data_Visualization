import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import SeasonOverview from './views/SeasonOverview.vue'
import MatchOverview from './views/MatchOverview.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/season-overview',
      name: 'season-overview',
      component: SeasonOverview
    },
    {
      path: '/match-overview',
      name: 'match-overview',
      component: MatchOverview
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
