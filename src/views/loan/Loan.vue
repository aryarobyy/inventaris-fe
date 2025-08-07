<template>
  <div class="flex">
    <div class="flex-1 min-h-screen">
      <div class="p-3 sm:p-6 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-white p-3 sm:p-6 rounded-lg shadow hover:shadow-md transition">
            <p class="text-gray-600 text-sm sm:text-base">Total Peminjaman</p>
            <h3 class="text-2xl sm:text-3xl font-bold text-blue-600">{{ total }}</h3>
          </div>
          <div class="bg-white p-3 sm:p-6 rounded-lg shadow hover:shadow-md transition">
            <p class="text-gray-600 text-sm sm:text-base">Pending</p>
            <h3 class="text-2xl sm:text-3xl font-bold text-yellow-500">{{ pending }}</h3>
          </div>
          <div class="bg-white p-3 sm:p-6 rounded-lg shadow hover:shadow-md transition sm:col-span-2 lg:col-span-1">
            <p class="text-gray-600 text-sm sm:text-base">Disetujui</p>
            <h3 class="text-2xl sm:text-3xl font-bold text-green-500">{{ approved }}</h3>
          </div>
        </div>

        <div>
          <h4 class="text-lg sm:text-xl font-semibold mb-4"> </h4>
          <div class="flex gap-1 sm:gap-4 flex-wrap">
            <button 
              class="bg-blue-600 text-white px-3 sm:px-6 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
              @click="() => $router.push('/user/loan')">
              Ajukan Peminjaman
            </button>
            <button 
              class="bg-gray-800 text-white px-3 sm:px-6 py-2 rounded hover:bg-gray-900 text-sm sm:text-base"
              @click="() => $router.push('/item')"
              >
              Lihat Semua Barang
            </button>
            <button
              class="bg-green-600 text-white px-3 sm:px-6 py-2 rounded hover:bg-green-700 text-sm sm:text-base"
              @click="() => $router.push('/loan/history')"
              >
              History
            </button>
          </div>
        </div>

        <div>
          <h4 class="text-lg sm:text-xl font-semibold mb-4">Peminjaman Terbaru</h4>
          <TableLoan 
            :showAction="false"
            :loans="loans"
            :isLoading="isLoading"
            :error="error"
          />

        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import TableLoan from '../../components/TableLoan.vue';
import useGetLoans from '../../hooks/useGetLoans';

const total = computed(() => loans.value.length);
const pending = computed(() => loans.value.filter((l) => l.loanStatus === 'pending').length);
const approved = computed(() => loans.value.filter((l) => l.loanStatus === 'approved').length);
const { loans, isLoading, error } = useGetLoans();

</script>