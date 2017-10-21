<template>
  <div>
    <input type="text" placeholder="search icon names and themes" v-model="search" >
  </input>
    <!-- searched icons -->
    <div v-for="icon in icons" @hover="() => shown = icon.name">
      <inline
      :class="{active: icon.name.match(search) || icon.theme.match(search)}"
      :name="'./' + icon.name + '-11.svg'"
      ></inline>
      <inline
      :class="{active: icon.name.match(search) || icon.theme.match(search)}"
      :name="icon.name + '-15.svg'"
      ></inline>
    </div>
    <div>
      {{shown}}
    </div>
  </div>
</template>
<script>
import maki from 'maki';
const icons = [];
for (let theme in maki.layouts.streets){
  for (let name of maki.layouts.streets[theme]){
    icons.push({name, theme});
  }
};
// const options = [].concat(maki.layouts.all.all, Object.keys(maki.layouts.streets)
export default {
  // no props
  data(){
    return {
      search:'',
      icons,
      shown:''
    };
  }
  // methods:{
  //   updateSearch(val){
  //     this.search = val;
  //   }
  // }
}
</script>
<style>
div:not(.active){
  opacity:.5
}
.active{
  color:#000
}
</style>
