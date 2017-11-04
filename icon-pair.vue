<template>
  <div
    class="icon-holder"
    :class="`$icon-${name}`"
    @hover="onHover"
    @click="onClick"
    :title="`${name} [${theme}]`"
  >
    <div class="icon-11">
      <inline
      :class="{active: active}"
      :name="`./${name}-11.svg`"
      ></inline>
    </div>
    <div class="icon-15">
      <inline
      :class="{active: active}"
      :name="`./${name}-15.svg`"
      ></inline>
    </div>
  </div>
</template>
<script>
  export default {
    props:['name', 'theme', 'search'],
    computed:{
      active(){
        var re = new RegExp(this.search, 'ig')
        return this.name.match(re)
          ||   this.theme.match(re)
      }
    },
    methods:{
      onHover(){this.$emit('hovered', {name:this.name, theme:this.theme})},
      onClick(){this.$emit('clicked', {name:this.name, theme:this.theme})}
    }
  }
</script>
<style scope>
  div.icon-holder {
    display: inline-block;
    border: 1px solid rgba(200,200,200,.5);
  }
  div.icon-holder:hover{
    border: 1px solid black;
  }
  div.icon-11{
    display: inline-block;
    margin:5px;
    width:11px;
    height: 11px;
  }
  div.icon-15 {
    display: inline-block;
    margin:5px;
    width: 15px;
    height: 15px;
  }
  span:not(.active){
    opacity:.3
  }
  /*span.active{
    color:#000
  }*/
</style>
