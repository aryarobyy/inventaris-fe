<script setup lang="ts">
import Navbar from './components/Navbar.vue';

</script>

<template>
  <div class="bg-white"> 
    <Navbar />
    <notifications></notifications>
    <router-view></router-view>
  </div>
</template>