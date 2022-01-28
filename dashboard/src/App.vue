<template>
  <div class="vue-tempalte">
    <!-- Navigation -->
    <nav class="navbar shadow bg-white rounded justify-content-between flex-nowrap flex-row fixed-top">
      <div class="container">
        <a class="navbar-brand float-left" href="/">
        <span style="color:black" class='hidden sm:inline h3'>Nolo<strong>Nolo<sup>+</sup></strong></span>
        </a>
      </div>
    </nav>

    <!-- Main -->
    <div class="App">
      <router-view />
    </div>
  </div>
</template>