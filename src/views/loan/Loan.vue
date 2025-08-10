<template>
  <div class="flex">
    <div class="flex-1 min-h-screen" style="background: linear-gradient(135deg, #DFDFDF 0%, #FFFFFF 100%);">
      <div class="p-3 sm:p-6 space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Total Peminjaman Card -->
          <div class="bg-white p-3 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#00C896] hover:scale-105">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-[#36454F] text-sm sm:text-base font-medium opacity-70">Total Peminjaman</p>
                <h3 class="text-2xl sm:text-3xl font-bold text-[#00C896] mt-1">{{ total }}</h3>
              </div>
              <div class="w-12 h-12 bg-gradient-to-br from-[#00C896] to-[#00A17C] rounded-full flex items-center justify-center">
                <ChartColumnIncreasing class="w-6 h-6 text-white"/>
              </div>
            </div>
          </div>

          <!-- Pending Card -->
          <div class="bg-white p-3 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#FFEB3B] hover:scale-105">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-[#36454F] text-sm sm:text-base font-medium opacity-70">Pending</p>
                <h3 class="text-2xl sm:text-3xl font-bold text-[#F57C00] mt-1">{{ pending }}</h3>
              </div>
              <div class="w-12 h-12 bg-gradient-to-br from-[#FFEB3B] to-[#F57C00] rounded-full flex items-center justify-center">
                <Clock class="w-6 h-6 text-white"/>
              </div>
            </div>
          </div>

          <!-- Disetujui Card -->
          <div class="bg-white p-3 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#00C896] hover:scale-105 sm:col-span-2 lg:col-span-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-[#36454F] text-sm sm:text-base font-medium opacity-70">Disetujui</p>
                <h3 class="text-2xl sm:text-3xl font-bold text-[#00C896] mt-1">{{ approved }}</h3>
              </div>
              <div class="w-12 h-12 bg-gradient-to-br from-[#00C896] to-[#00A17C] rounded-full flex items-center justify-center">
                <Check class="w-6 h-6 text-white"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h4 class="text-lg sm:text-xl font-bold text-[#36454F] mb-4">Quick Actions</h4>
          <div class="flex gap-2 sm:gap-4 flex-wrap">
            <button 
              class="bg-gradient-to-r from-[#00C896] to-[#00A17C] text-white px-4 sm:px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 text-sm sm:text-base font-semibold hover:scale-105 flex items-center gap-2"
              @click="() => $router.push('/user/loan')">
              <Plus class="w-6 h-6 text-white" />
              Ajukan Peminjaman
            </button>
            <button 
              class="bg-gradient-to-r from-[#36454F] to-[#2C3E50] text-white px-4 sm:px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 text-sm sm:text-base font-semibold hover:scale-105 flex items-center gap-2"
              @click="() => $router.push('/item')">
              <GalleryVerticalEnd class="w-6 h-6 text-white"/>
              Lihat Semua Barang
            </button>
            <button
              class="bg-gradient-to-r from-[#FFEB3B] to-[#F57C00] text-[#36454F] px-4 sm:px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 text-sm sm:text-base font-semibold hover:scale-105 flex items-center gap-2"
              @click="() => $router.push('/loan/history')">
                <Clock class="w-6 h-6 text-black"/>
              History
            </button>
          </div>
        </div>

        <!-- Recent Loans Table -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-1 h-6 bg-gradient-to-b from-[#00C896] to-[#FFEB3B] rounded-full"></div>
            <h4 class="text-lg sm:text-xl font-bold text-[#36454F]">Peminjaman Terbaru</h4>
          </div>
          <div class="overflow-hidden rounded-lg border border-[#DFDFDF]">
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
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import TableLoan from '../../components/TableLoan.vue';
import useGetLoans from '../../hooks/useGetLoans';
import { ChartColumnIncreasing, ChartNoAxesColumnIncreasing, Check, Clock, GalleryVerticalEnd, Plus } from 'lucide-vue-next';

const total = computed(() => loans.value.length);
const pending = computed(() => loans.value.filter((l) => l.loanStatus === 'pending').length);
const approved = computed(() => loans.value.filter((l) => l.loanStatus === 'approved').length);
const { loans, isLoading, error } = useGetLoans();

</script>


<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #DFDFDF;
}

::-webkit-scrollbar-thumb {
  background: #00C896;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00A17C;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>