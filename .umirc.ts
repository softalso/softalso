import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/login',wrappers:['@/authentication']},
    { path: '/index', component: '@/pages/index'},
    { path: '/home', component: '@/pages/home',wrappers:['@/authentication'],routes:[
      { path: '/home/welcome', component: '@/pages/welcome' },
      { path: '/home/users', component: '@/pages/users' },
      { path: '/home/roles', component: '@/pages/jurisdiction/roles' },
      { path: '/home/rights', component: '@/pages/jurisdiction/Rights' },
      { path: '/home/goods', component: '@/pages/commodity/goods' },
    ]},
  ],
  fastRefresh: {},
  // proxy: {
  //   '/api': {
  //     target: 'http://localhost:9093',
  //     pathRewrite: { '^/api': '' },
  //     changeOrigin: true
  //   }
  // }
});


