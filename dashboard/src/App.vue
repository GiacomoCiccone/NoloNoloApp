<template>
  <div class="vue-tempalte container-fluid" style="padding:0px">
    <!-- Navigation -->
    <nav style=" box-shadow: 0px 2px 5px rgba(0,0,0, 0.2);" class="navbar bg-white rounded justify-content-between flex-nowrap flex-row fixed-top">
      <div class="container-fluid">
        <router-link class="navbar-brand float-left" style="margin-left:5%" to="/">
        <span style="color:black" class='hidden sm:inline h3'>Nolo<strong>Nolo<sup>+</sup></strong></span>
        </router-link>

        <div style="display: flex; align-items: center; gap: 1rem; margin-right: 5%">
          <span v-if="userInfoManager">Ciao, {{JSON.parse(userInfoManager).first_name}}</span>

        <button v-on:click="logout" aria-label="Clicca per uscire dall'account." style="border: none; background-color: #101010; color: #fff; border-radius: 10px; padding: 0.5rem 1rem;" v-if="userInfoManager">Esci</button>
        </div>
        
      </div>
    </nav>

    <!-- Main -->
    <div class="App">
      <router-view />
    </div>
  </div>
</template>


<script>
    export default {
        data: () => ({
          userInfoManager: null,
        }),

        updated() {
          this.userInfoManager = window.localStorage.getItem("userInfoManager")
        },

        methods: {
          logout() {
            window.localStorage.removeItem('authTokenManager')
            window.localStorage.removeItem('userInfoManager')
            this.$router.push({ path: "/login" });
          }
        }

    }
</script>