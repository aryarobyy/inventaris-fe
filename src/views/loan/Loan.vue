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
              @click="() => $router.push('/loan/user')">
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

          <!-- Mobile View -->
          <div class="block sm:hidden space-y-3">
            <div v-for="loan in loansData" :key="loan.id" class="bg-white rounded-lg shadow p-3">
              <div class="flex justify-between items-start mb-1">
                <div>
                  <p class="text-sm text-gray-600">ID: {{ loan.id }}</p>
                  <p class="font-semibold">{{ loan.borrower.name }}</p>
                </div>
                <span :class="[statusClass(loan.loanStatus)]">{{ loan.loanStatus }}</span>
              </div>
              <div class="mb-1">
                <p class="text-sm text-gray-600 mb-1">Barang:</p>
                <ul class="text-sm text-gray-700">
                  <li v-for="item in loan.loanItems" :key="item.item.id">• {{ item.item.name }}</li>
                </ul>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <p>Pinjam: {{ formatDate(loan.loanDate) }}</p>
                <p>Tempo: {{ formatDate(loan.dueDate) }}</p>
              </div>
            </div>
          </div>

          <!-- Desktop View -->
          <div class="hidden sm:block">
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                      <th class="p-2 text-left whitespace-nowrap">ID</th>
                      <th class="p-2 text-left whitespace-nowrap">Peminjam</th>
                      <th class="p-2 text-left whitespace-nowrap">Barang</th>
                      <th class="p-2 text-left whitespace-nowrap">Tanggal Pinjam</th>
                      <th class="p-2 text-left whitespace-nowrap">Jatuh Tempo</th>
                      <th class="p-2 text-left whitespace-nowrap">Tanggal Pengembalian</th>
                      <th class="p-2 text-left whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-700 text-sm divide-y divide-gray-200">
                    <tr v-for="loan in loansData" :key="loan.id" class="hover:bg-gray-50">
                      <td class="p-2 whitespace-nowrap">{{ loan.id }}</td>
                      <td class="p-2 whitespace-nowrap">{{ loan.borrower.name }}</td>
                      <td class="p-2">
                        <ul class="list-disc pl-4">
                          <li v-for="item in loan.loanItems" :key="item.item.id">{{ item.item.name }}</li>
                        </ul>
                      </td>
                      <td class="p-2 whitespace-nowrap">{{ formatDate(loan.loanDate) }}</td>
                      <td class="p-2 whitespace-nowrap">{{ formatDate(loan.dueDate) }}</td>
                      <td class="p-2 whitespace-nowrap">{{ formatDate(loan.notes!) }}</td>
                      <td class="p-2 whitespace-nowrap">
                        <span :class="[statusClass(loan.loanStatus)]">{{ loan.loanStatus }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { LoanModel } from '../../models/loan.model';
import { getLoans } from '../../provider/loan.provider';

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

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

const statusClass = (status: string) => {
  return [
    'px-2 py-1 rounded text-white text-xs font-semibold',
    status === 'pending' ? 'bg-yellow-500' : status === 'approved' ? 'bg-green-500' : 'bg-red-500'
  ];
};
</script>
