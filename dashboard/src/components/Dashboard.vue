<template>
  <div class="vertical-center">
    <div id="dashboard">
      <PlanetChart />
    </div>
  </div>
</template>

<script>
import PlanetChart from "./PlanetChart.vue";
import axios from "axios";

export default {
  components: {
    PlanetChart,
  },
  name: "Dashboard",
  data() {
    return {
      rents: [],
      users: [],
      cars: [],
      error: null,
    };
  },

  async beforeMount() {
    if (!window.localStorage.getItem("authTokenManager"))
      this.$router.push({ path: "/" });
    else {
      const token = window.localStorage.getItem("authTokenManager")
      const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

      //fetch users
      try {
        const {data} = await axios.get("http://localhost:8000/api/users", config)
        this.users = data.data
      } catch (error) {return}

      //fetch cars
      try {
      const {data} = await axios.get("http://localhost:8000/api/cars", config)
      this.cars = data.data
      } catch (error) {return}

      //fetch rents

      try {
      const {data} = await axios.get("http://localhost:8000/api/rents", config)
      this.rents = data.data
      } catch (error) {return}
    }
  },
};
</script>

<style>
#dashboard {
  width: 80%;
  margin: 50px auto;
  background-color: lightblue;
}
</style>