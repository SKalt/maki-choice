<template>
  <div class="container-fluid">
    <div class="col-6">
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
          v-on:clicked="showIcon"
          v-on:hovered="showIcon"
        ></icon-pair>
      </div>
    </div>
    <display-icon-pair v-bind="shown"></display-icon-pair>
  </div>
</template>
<script>
import maki from 'maki';
import iconPair from './icon-pair.vue';
import displayIconPair from './display-icon-pair.vue';
const icons = [];
for (let theme in maki.layouts.streets){
  for (let name of maki.layouts.streets[theme]){
    icons.push({name, theme});
  }
};
// const options = [].concat(maki.layouts.all.all, Object.keys(maki.layouts.streets)
export default {
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
    getSvgId(name){
      return document.querySelector(`icon`);
    },
    showIcon(toShow){
      this.shown = toShow
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
  width: 100%;
}
</style>
