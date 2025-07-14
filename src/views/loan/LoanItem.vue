<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1>
      Selamat Datang di Aplikasi Inventaris
    </h1>
    <Button 
    text="Pinjam barang"
    variant="outline"
    size="medium"
    @click="$router.push('/loan/user')"
    />
  </div>
</template>

<script setup lang="ts">
  import Button from '../../components/Button.vue';
</script>

<style scoped>

</style>