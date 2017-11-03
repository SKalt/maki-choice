import Vue from 'vue';
import app from './maki-choice.vue';
import Inline from 'vue-inline';

var req = require.context('./node_modules/maki/icons', true, /.svg$/);
const icons = {};
req.keys().forEach((key) => {
  // console.log(key);
  icons[key] = req(key)
});
// console.log(icons);
// console.log(req.keys())
Vue.use(Inline, {
  data:icons
});

new Vue(app).$mount('#maki-choice');
