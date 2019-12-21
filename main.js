(async () => {
  var router = new VueRouter({
    // mode: 'history',
    // base: '/',
    routes: [
      {
        path: '',
        component: Users(),
        meta: { loginflag: true },
        children: [
          {
            path: '/',
            name: 'question',
            component: Question(),
            meta: { loginflag: true }
          },
          {
            path: 'histories/:qid',
            name: 'histories',
            component: Histories(),
            meta: { loginflag: true }
          }
        ]
      },
      {
        path: '/admin',
        name: 'admin',
        component: Admin(),
        meta: { loginflag: true, auth: true }
      },
      {
        path: '/login',
        name: 'login',
        component: Login(),
        meta: { loginflag: true }
      },
      {
        path: '*',
        redirect: '/'
      }
    ]
  });

  router.beforeEach(async (to, from, next) => {
    await Vue.nextTick();
    if (to.path !== '/login') {
      to.meta.loginflag && app.login.loginId === ''
        ? next({ path: '/login' })
        : next();
    } else {
      next();
    }
  });

  var app = new Vue({
    el: '#app',
    router,
    data: {
      login: {
        loginName: '',
        auth: 0,
        loginId: '1'
      }
    },
    mounted() {
      this.loginHandler();
    },
    methods: {
      loginHandler() {
        axios.get('./data.json').then(response => console.log(response.data));
      }
    }
  });
})();
