<script setup lang="ts">
import Navbar from './components/Navbar.vue';

</script>

<template>
  <div class="bg-primary"> 
    <Navbar />
    <notifications></notifications>
    <router-view></router-view>
  </div>
</template>