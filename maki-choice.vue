<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-6 col-sm-12">
        <input
          class="col-xs-12"
          type="text"
          placeholder="search icon names and themes"
          v-model="search"
          >
        </input>
        <!-- searched icons -->
        <div class="col-xs-12">
          <icon-pair
            v-for="icon in icons"
            v-bind="icon"
            :search="search"
            :key="icon.name"
            v-on:clicked="showIconClicked"
            v-on:hovered="showIcon"
          ></icon-pair>
        </div>
      </div>
      <display-icon-pair v-bind="shown"></display-icon-pair>
    </div>
  </div>
</template>
<script>
import presentIcons from './svg.js';
import maki from 'maki';
import iconPair from './icon-pair.vue';
import displayIconPair from './display-icon-pair.vue';

const icons = [];
const named = new Set()
for (let theme in maki.layouts.streets){
  for (let name of maki.layouts.streets[theme]){
    icons.push({name, theme});
    named.add(name);
  }
}
let theme = 'unclassified'
for (let name of presentIcons.filter(icon => !named.has(icon))){
  icons.push({name, theme});
}
export default {
  mounted(){
    // HACK: to remove all non-displaying svg
    Array.from(document.querySelectorAll('metadata'))
      .map(el => el.parentElement)
      .forEach(svg => svg.appendChild(svg.querySelector('path')));
    let hash = window.location.hash.slice(1);
    if (hash){
      let matchedIcon = icons.filter(icon => icon.name == hash);
      if (matchedIcon.length == 1){
        matchedIcon = matchedIcon[0];
        this.showIcon(matchedIcon);
      }
    }
  },
  data(){
    return {
      search:'',
      icons,
      shown:{
        name:'',
        theme:''
      }
    };
  },
  methods:{
    showIconClicked(toShow){
      window.location.hash = toShow.name;
      this.showIcon(toShow);
    },
    showIcon(toShow){
      this.shown = toShow;
    }
  },
  components:{iconPair, displayIconPair}
}
</script>
<style scoped>
/*div {
  display: inline-block;
}*/
input{
  padding:4px;
  width: 100%;
}
</style>
