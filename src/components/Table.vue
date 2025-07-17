<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Manajemen Peminjaman</h1>
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="relative flex-1 max-w-md">
            <input 
              v-model="search" 
              placeholder="Cari barang atau peminjam..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
            <select 
              v-model="filterStatus" 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option 
                v-for="option in loanStatusOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-sm text-gray-600">Memuat data...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error memuat data</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      </div>

      <!-- Data content -->
      <div v-else>
        <!-- Mobile View -->
        <div class="block sm:hidden space-y-3">
          <div v-for="(loan, loanIndex) in filteredLoansAlternative" :key="loan.id" class="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div class="flex justify-between items-start mb-3">
              <div>
                <div class="flex items-center mb-1">
                  <div class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-2">
                    {{ loanIndex + 1 }}
                  </div>
                  <p class="text-sm text-gray-600">ID: {{ loan.id }}</p>
                </div>
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-6 w-6 mr-2">
                    <div class="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-xs font-medium text-gray-700">{{ getInitials(loan.borrower.name) }}</span>
                    </div>
                  </div>
                  <p class="font-semibold text-gray-900">{{ loan.borrower.name }}</p>
                </div>
              </div>
              <span :class="[statusClass(loan.loanStatus)]">{{ getStatusText(loan.loanStatus) }}</span>
            </div>
            
            <div class="mb-3">
              <p class="text-sm text-gray-600 mb-2">Barang:</p>
              <div class="space-y-1">
                <div v-for="item in loan.loanItems" :key="item.item.id" class="flex justify-between items-center">
                  <span class="text-sm text-gray-700">• {{ item.item.name }}</span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ item.borrowedQuantity }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex justify-between text-sm text-gray-600 mb-3">
              <p>Pinjam: {{ formatDate(loan.loanDate) }}</p>
              <p>Tempo: {{ formatDate(loan.dueDate) }}</p>
            </div>
            
            <div class="flex justify-center space-x-2 pt-2 border-t border-gray-200">
              <button 
                @click="updateLoanStatus(loan, LoanStatus.APPROVED)"
                class="flex-1 inline-flex items-center justify-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :disabled="loan.loanStatus === LoanStatus.APPROVED"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Setujui
              </button>
              <button 
                @click="updateLoanStatus(loan, LoanStatus.CANCELLED)"
                class="flex-1 inline-flex items-center justify-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :disabled="loan.loanStatus === LoanStatus.CANCELLED"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Tolak
              </button>
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
                    <th class="p-3 text-left whitespace-nowrap">No</th>
                    <th class="p-3 text-left whitespace-nowrap">ID</th>
                    <th class="p-3 text-left whitespace-nowrap">Peminjam</th>
                    <th class="p-3 text-left whitespace-nowrap">Barang</th>
                    <th class="p-3 text-left whitespace-nowrap">Tgl Pinjam</th>
                    <th class="p-3 text-left whitespace-nowrap">Tgl Tempo</th>
                    <th class="p-3 text-center whitespace-nowrap">Status</th>
                    <th
                    v-if="props.showAction"
                    class="p-3 text-center whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700 text-sm divide-y divide-gray-200">
                  <tr v-for="(loan, loanIndex) in filteredLoansAlternative" :key="loan.id" class="hover:bg-gray-50 transition-colors">
                    <td class="p-3 whitespace-nowrap">
                      <div class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {{ loanIndex + 1 }}
                      </div>
                    </td>
                    <td class="p-3 whitespace-nowrap font-medium">{{ loan.id }}</td>
                    <td class="p-3 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-8 w-8">
                          <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-700">{{ getInitials(loan.borrower.name) }}</span>
                          </div>
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">{{ loan.borrower.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="p-3">
                      <div class="space-y-1">
                        <div v-for="item in loan.loanItems" :key="item.item.id" class="flex justify-between items-center">
                          <span class="text-sm">• {{ item.item.name }}</span>
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                            {{ item.borrowedQuantity }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td class="p-3 whitespace-nowrap">{{ formatDate(loan.loanDate) }}</td>
                    <td class="p-3 whitespace-nowrap">{{ formatDate(loan.dueDate) }}</td>
                    <td class="p-3 whitespace-nowrap text-center">
                      <span :class="[statusClass(loan.loanStatus)]">{{ getStatusText(loan.loanStatus) }}</span>
                    </td>
                    <td class="p-3 whitespace-nowrap text-center">
                      <div 
                      v-if="props.showAction"
                      class="flex justify-center space-x-2">
                        <button 
                          @click="updateLoanStatus(loan, LoanStatus.APPROVED)"
                          class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          :disabled="loan.loanStatus === LoanStatus.APPROVED"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Setujui
                        </button>
                        <button 
                          @click="updateLoanStatus(loan, LoanStatus.CANCELLED)"
                          class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          :disabled="loan.loanStatus === LoanStatus.CANCELLED"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredLoansAlternative.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4c0-1.313.253-2.6.712-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.814 2.602 9.288 6.286" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada data peminjaman</h3>
          <p class="mt-1 text-sm text-gray-500">Tidak ada peminjaman yang sesuai dengan kriteria pencarian.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { LoanModel } from '../models/loan.model'
import { updateLoan } from '../provider/loan.provider'
import { LoanStatus } from '../models/enums'

interface Props {
  showAction?: boolean;
  loans: LoanModel[];
  isLoading: boolean;
  error: any
}

const props = withDefaults(defineProps<Props>(), {
  showAction: false,
  loans:() => [],
  isLoading: false,
  error: ""
})


const loansPending = computed(() => props.loans.filter((loan) => loan.loanStatus === LoanStatus.PENDING));
const search = ref('')
const filterStatus = ref('')

const filteredLoansAlternative = computed(() => {
  if (!search.value && !filterStatus.value) {
    return props.loans;
  }

  return props.loans.filter((loan) => {
    const searchTerm = search.value.toLowerCase().trim();
    
    const searchMatch = !searchTerm || 
      loan.borrower.name?.toLowerCase().includes(searchTerm) ||
      loan.loanItems.some(loanItem => 
        loanItem.item.name.toLowerCase().includes(searchTerm)
      );
    
    const statusMatch = !filterStatus.value || loan.loanStatus === filterStatus.value;
    
    return searchMatch && statusMatch;
  });
});

const getInitials = (name: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loanStatusOptions = [
  { value: '', label: 'Semua Status' },
  { value: LoanStatus.PENDING, label: 'Pending' },
  { value: LoanStatus.ACTIVE, label: 'Aktif' },
  { value: LoanStatus.APPROVED, label: 'Disetujui' },
  { value: LoanStatus.RETURNED, label: 'Dikembalikan' },
  { value: LoanStatus.OVERDUE, label: 'Terlambat' },
  { value: LoanStatus.CANCELLED, label: 'Ditolak' },
];


const getStatusText = (status: LoanStatus) => {
  switch (status) {
    case LoanStatus.PENDING:
      return 'Pending'
    case LoanStatus.APPROVED:
      return 'Disetujui'
    case LoanStatus.CANCELLED:
      return 'Ditolak'
    default:
      return status
  }
}

const statusClass = (status: LoanStatus) => {
  const baseClass = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full';
  switch (status) {
    case LoanStatus.PENDING:
      return `${baseClass} bg-yellow-100 text-yellow-800`;
    case LoanStatus.APPROVED:
      return `${baseClass} bg-green-100 text-green-800`;
    case LoanStatus.CANCELLED:
      return `${baseClass} bg-red-100 text-red-800`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800`;
  }
}

const updateLoanStatus = async (loan: LoanModel, newStatus: LoanStatus) => {
  try {
    const data = await updateLoan(
      loan.id,{
        loanStatus: newStatus
      }
    )
    console.log(`Updating loan ${loan.id} to ${newStatus}`)
    console.log("WOIII", data)
  } catch (error) {
    console.error('Error updating loan status:', error)
  }
}
</script>