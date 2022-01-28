<template>
    <div class="vertical-center">
        <div id="dashboard">
            <PlanetChart/>
        </div>
    </div>
</template>

<script>
  import PlanetChart from './PlanetChart.vue'

  export default {
    components: {
      PlanetChart
    }
    
  }
</script>

<style>
  #dashboard {
    width: 80%;
    margin:50px auto;
    background-color: lightblue;
  }
</style>