import Vue from 'vue';
import Inline from 'vue-inline';

var req = require.context('./maki/icons', true, /\.svg$/);
const icons = {};
const all = new Set();
req.keys().forEach((key) => {
  // console.log(key);
  icons[key] = req(key);
  all.add(key
    .replace('.svg', '')
    .replace('-15', '')
    .replace('-11', '')
    .replace('./', '')
  );
});
Vue.use(Inline, {
  data:icons
});

export default Array.from(all);
