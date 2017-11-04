<template>
  <div class="col-md-5 col-sm-12">
    <!-- title stuff -->
    <div class="row icon-info">
      <div class="col-12">
        <h3>{{name || 'Icon'}} {{theme ? `  [${theme}]` : 'info'}}</h3>
      </div>
      <!-- <h3 class="col-3">{{name || 'Icon'}}</h3>
      <h4>{{theme ? `Theme: ${theme}`: 'Info'}}</h4> -->
    </div>
    <!-- icons -->
    <div class="row display-icons">
      <div class="col-12">
          <div class="display-icon-11">
            <inline :name="`./${name}-11.svg`"></inline>
          </div>
          <div class="display-icon-15">
            <inline :name="`./${name}-15.svg`"></inline>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:['name', 'theme'],
    updated(){
      Array.from(document.querySelectorAll('metadata'))
        .map(el => el.parentElement)
        .forEach(svg => svg.appendChild(svg.querySelector('path')))
    }
  }
</script>
<style scoped>
  h3{
    text-align: center;
  }
  .align {
    display: block;
    margin: auto;
  }
  .display-icon-11 {
    display: inline-block;
    border:1px solid;
    width:  110px;
    height: 110px;
    margin-left: calc(50% - 130px)
  }
  .display-icon-15{
    display: inline-block;
    border:1px solid;
    height:150px;
    width:150px;
  }
</style>
