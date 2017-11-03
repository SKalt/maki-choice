<template>
  <div class="col-5">
    <!-- title stuff -->
    <div class="icon-info">
      <h3>{{name}}</h3>
      <h4 v-show="theme">Theme: {{theme}}</h4>
    </div>
    <!-- icons -->
    <div class="display-icons">
      <div class="display-icon-11">
        <inline :name="`./${name}-11.svg`"></inline>
      </div>
      <div class="display-icon-15">
        <inline :name="`./${name}-15.svg`"></inline>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:['name', 'theme']
  }
</script>
<style scoped>
  .display-icon-11 {
    display: inline-block;
    border:1px solid;
    width: calc(20vh * .7333333);
    height: calc(20vh * .7333333);
  }
  .display-icon-15{
    display: inline-block;
    border:1px solid;
    width: 20vh;
    height: 20vh;
  }
</style>
