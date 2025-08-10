<template>
  <div class="flex">
    <div class="flex-1 min-h-screen bg-gray-50">
      <div class="p-3 sm:p-6 space-y-6">
        <!-- Ringkasan -->
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

        <!-- Tombol Cepat -->
        <div>
          <h4 class="text-lg sm:text-xl font-semibold mb-4">Tindakan Cepat</h4>
          <div class="flex gap-1 sm:gap-4 flex-wrap">
            <button 
              class="bg-blue-600 text-white px-3 sm:px-6 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
              @click="() => $router.push('/user/booking')">
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
          />

        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { LoanModel } from '../../models/loan.model';
import { getLoans } from '../../provider/loan.provider';
import TableLoan from '../../components/TableLoan.vue';
import MyButton from '../../components/Button.vue';

const loansData = ref<LoanModel[]>([]);
const total = computed(() => loansData.value.length);
const pending = computed(() => loansData.value.filter((l) => l.loanStatus === 'pending').length);
const approved = computed(() => loansData.value.filter((l) => l.loanStatus === 'approved').length);


onMounted(async () => {
  try {
    const res = await getLoans();
    loansData.value = Array.isArray(res) ? res : [];
  } catch (error) {
    console.error(error);
  }
});

const formatDate = (date: string | null | undefined): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const statusClass = (status: string): string => {
  return [
    'px-2 py-1 rounded text-white text-xs font-semibold',
    status === 'pending' ? 'bg-yellow-500' : status === 'approved' ? 'bg-green-500' : 'bg-red-500'
  ].join(' ');
};
</script>
