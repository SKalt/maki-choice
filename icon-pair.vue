<template>
  <div
    class="icon-holder"
    :class="`$icon-${name}`"
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
      :name="`$./${name}-15.svg`"
      ></inline>
    </div>
  </div>
</template>
<script>
  export default {
    props:['name', 'theme', 'search'],
    watched:{
      active(){
        return this.name.match(  new RegExp(this.search, 'ig'))
          ||   this.theme.match( new RegExp(this.search, 'ig'))
      }
    }
  }
</script>
<style scope>
  div.icon-11{
    width:11px;
    height: 11px;
  }
  div.icon-15 {
    width: 15px;
    height: 15px;
  }
</style>
