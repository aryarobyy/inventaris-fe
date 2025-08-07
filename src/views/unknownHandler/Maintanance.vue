<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-yellow-800 p-6">
    <div class="text-6xl font-bold mb-4">🚧</div>
    <h1 class="text-3xl font-semibold mb-2">Sedang dalam tahap Pengembangan</h1>
    <p class="text-center max-w-md mb-6">
      Maaf atas ketidaknyamanannya. Kami sedang melakukan pengambangan pada bagian ini. Silakan kembali lagi nanti.
    </p>
    <MyButton text="Kembali ke Beranda" @click="$router.push('/')" />
  </div>
</template>

<script lang="ts" setup>
import MyButton from '../../components/Button.vue';


</script>
