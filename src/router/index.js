import Vue from "vue";
import VueRouter from "vue-router";
import TokenService from "../utils/TokenService";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '/slider',
        name: 'slider',
        component: () => import('../pages/carousel')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import('../pages/role')
      },
      {
        path: '/pages',
        name: 'pages',
        component: () => import('../pages/pages')
      },
    ]
  },
  {
    path: '/',
    component: () => import('../layouts/LoginLayout.vue'),
    children: [
      {
        path: '/',
        name: 'login',
        meta: {
          public: true,
          onlyWhenLoggedOut: true
        },
        component: () => import('../pages/Login.vue'),
      },
    ]
  },

];

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  TokenService.checkExpire();
  let token = !!TokenService.getToken();
  const isPublic = to.matched.some(record => record.meta.public)
  const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut)

  if (!token && !isPublic) {
    return next({
      name: 'login'
    })
  }
  if (token && onlyWhenLoggedOut) {
    return next({
      name: 'slider'
    })
  }


  next();
})

export default router;
