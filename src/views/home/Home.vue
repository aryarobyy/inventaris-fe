<template>
  <div class="flex items-center justify-center min-h-screen bg-[var(--color-second)]">
    <div class="text-center p-8 bg-white shadow-lg rounded-xl max-w-lg">
      <h1 class="text-3xl font-bold mb-4 text-[var(--color-primary)]">Selamat Datang!</h1>
      <p class="mb-6 text-[var(--color-tertiary)]">
        Silakan pilih layanan yang ingin Anda gunakan.
      </p>
      <div class="flex space-x-4">
        <MyButton 
          text="Booking Ruangan"
          @click="$router.push('book')"/>
        <MyButton
          text="Pinjam Barang" 
          @click="$router.push('/loan')"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import MyButton from '../../components/Button.vue';


const router = useRouter();
const handleBooking = () => {

}

const handleLoan = () => {
  
}
</script>
