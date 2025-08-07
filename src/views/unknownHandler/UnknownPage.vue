<!-- pages/NotFound.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-800 p-6">
    <div class="text-6xl font-bold mb-4">😵‍💫</div>
    <h1 class="text-3xl font-semibold mb-2">Oops! Kamu Kejauhan</h1>
    <p class="text-center max-w-md mb-6">
      Halaman yang kamu cari tidak ditemukan. Yuk kembali ke jalur yang benar!
    </p>
    <MyButton text="Kembali ke Beranda" @click="$router.push('/')" />
  </div>
</template>

<script lang="ts" setup>
import MyButton from '../../components/Button.vue';
</script>