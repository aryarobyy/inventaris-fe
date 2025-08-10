<template>
  <div class="p-6 min-h-screen" style="background: linear-gradient(135deg, #DFDFDF 0%, #FFFFFF 100%);">
    <div class="rounded-xl shadow-lg p-6" style="background-color: #FFEB3B;">
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-4" style="color: #36454F;">Manajemen Peminjaman</h1>

        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="relative flex-1 max-w-md">
            <input
              v-model="search"
              placeholder="Cari barang atau peminjam..."
              class="w-full pl-10 pr-4 py-3 rounded-xl transition-all duration-300 shadow-md
                     border-2 border-transparent bg-white placeholder:text-gray-500
                     focus:ring-2 focus:border-transparent hover:shadow-lg"
              style="color: #36454F; --tw-ring-color: #00C896;"
            />
            <svg class="absolute left-3 top-3.5 h-5 w-5" style="color: #36454F;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          <select
            v-model="filterStatus"
            class="px-4 py-3 rounded-xl border-2 border-transparent bg-white shadow-md
                   focus:ring-2 focus:border-transparent transition-all duration-300 hover:shadow-lg"
            style="color: #36454F; --tw-ring-color: #00C896;"
          >
            <option v-for="option in loanStatusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <Loading v-if="isLoading" :isLoading="isLoading" />

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color: #00C896;">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="mt-2 text-lg font-semibold" style="color: #36454F;">Error memuat data</h3>
        <p class="mt-1 text-sm opacity-70" style="color: #36454F;">{{ error }}</p>
      </div>

      <div v-else>
        <!-- Mobile View -->
        <div class="block sm:hidden space-y-4">
          <div v-for="(loan, loanIndex) in paginatedLoans" :key="loan.id"
               class="bg-white rounded-xl shadow-lg p-5 border-l-4 hover:shadow-xl transition-all duration-300"
               style="border-left-color: #00C896;">
            <div class="flex justify-between items-start mb-4">
              <div>
                <div class="flex items-center mb-2">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-3 text-white"
                       style="background: linear-gradient(135deg, #00C896, #00A17C);">
                    {{ ((currentPage - 1) * itemsPerPage) + loanIndex + 1 }}
                  </div>
                  <p class="text-sm opacity-70" style="color: #36454F;">ID: {{ loan.id }}</p>
                </div>

                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 mr-3">
                    <div class="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold"
                         style="background: linear-gradient(135deg, #36454F, #2C3E50);">
                      <span class="text-sm">{{ getInitials(loan.borrower.name) }}</span>
                    </div>
                  </div>
                  <p class="font-bold" style="color: #36454F;">{{ loan.borrower.name }}</p>
                </div>
              </div>

              <span :class="[statusClass(loan.loanStatus)]">{{ getStatusText(loan.loanStatus) }}</span>
            </div>

            <div class="mb-4">
              <p class="text-sm font-medium mb-2" style="color: #36454F;">Barang:</p>
              <div class="space-y-2">
                <div v-for="item in loan.loanItems" :key="item.item.id" 
                     class="flex justify-between items-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                  <span class="text-sm font-medium" style="color: #36454F;">• {{ item.item.name }}</span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white"
                        style="background: linear-gradient(135deg, #FFEB3B, #F57C00); color: #36454F;">
                    {{ item.borrowedQuantity }}
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
              <div class="text-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                <p class="font-medium" style="color: #36454F;">Tanggal Pinjam</p>
                <p class="text-xs opacity-70" style="color: #36454F;">{{ formatDate(loan.loanDate) }}</p>
              </div>
              <div class="text-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                <p class="font-medium" style="color: #36454F;">Tanggal Tempo</p>
                <p class="text-xs opacity-70" style="color: #36454F;">{{ formatDate(loan.dueDate) }}</p>
              </div>
            </div>

            <div v-if="props.showAction" class="flex justify-center pt-3 border-t" style="border-color: #DFDFDF;">
              <div class="w-full max-w-[200px]">
                <Dropdown
                  :model-value="getCurrentStatusOption(loan.loanStatus)"
                  :options="statusChangeOptions"
                  value-key="value"
                  label-key="label"
                  :multiple="false"
                  @update:model-value="updateLoanStatus(loan, $event.value)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop View -->
        <div class="hidden sm:block">
          <div class="rounded-xl shadow-lg overflow-hidden" style="background-color: #36454F;">
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead class="text-white uppercase text-sm font-bold" style="background-color: #DFDFDF; color: #36454F;">
                  <tr>
                    <th class="p-4 text-left whitespace-nowrap">No</th>
                    <th class="p-4 text-left whitespace-nowrap">ID Peminjaman</th>
                    <th class="p-4 text-left whitespace-nowrap">Peminjam</th>
                    <th class="p-4 text-left whitespace-nowrap">Barang</th>
                    <th class="p-4 text-left whitespace-nowrap">Tgl Pinjam</th>
                    <th class="p-4 text-left whitespace-nowrap">Tgl Tempo</th>
                    <th class="p-4 text-center whitespace-nowrap">Status</th>
                    <th v-if="props.showAction" class="p-4 text-center whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>

                <tbody class="text-white text-sm" style="background-color: #36454F;">
                  <tr v-for="(loan, loanIndex) in paginatedLoans" :key="loan.id"
                      class="transition-all duration-300 hover:bg-white/10 border-b border-white/10">
                    <td class="p-4 text-center">
                      <div class="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold text-white"
                           style="background: linear-gradient(135deg, #00C896, #00A17C);">
                        {{ ((currentPage - 1) * itemsPerPage) + loanIndex + 1 }}
                      </div>
                    </td>

                    <td class="p-4 whitespace-nowrap font-bold">{{ loan.id }}</td>

                    <td class="p-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 mr-3">
                          <div class="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                               style="background: linear-gradient(135deg, #FFEB3B, #F57C00); color: #36454F;">
                            <span class="text-sm">{{ getInitials(loan.borrower.name) }}</span>
                          </div>
                        </div>
                        <div>
                          <div class="text-sm font-bold text-white">{{ loan.borrower.name }}</div>
                        </div>
                      </div>
                    </td>

                    <td class="p-4">
                      <div class="space-y-1">
                        <div v-for="item in loan.loanItems" :key="item.item.id" class="flex items-center">
                          <span class="text-sm text-white">• {{ item.item.name }}</span>
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ml-3"
                                style="background: linear-gradient(135deg, #FFEB3B, #F57C00); color: #36454F;">
                            {{ item.borrowedQuantity }}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td class="p-4 whitespace-nowrap text-white font-medium">{{ formatDate(loan.loanDate) }}</td>
                    <td class="p-4 whitespace-nowrap text-white font-medium">{{ formatDate(loan.dueDate) }}</td>

                    <td class="p-4 whitespace-nowrap text-center">
                      <span :class="[statusClass(loan.loanStatus)]">{{ getStatusText(loan.loanStatus) }}</span>
                    </td>

                    <td class="p-4 whitespace-nowrap text-center" v-if="props.showAction">
                      <div class="flex justify-center">
                        <div class="w-full max-w-[160px]">
                          <Dropdown
                            :model-value="getCurrentStatusOption(loan.loanStatus)"
                            :options="statusChangeOptions"
                            value-key="value"
                            label-key="label"
                            :multiple="false"
                            @update:model-value="updateLoanStatus(loan, $event.value)"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="paginatedLoans.length === 0" class="text-center py-16">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
               style="background: linear-gradient(135deg, #36454F, #2C3E50);">
            <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4c0-1.313.253-2.6.712-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.814 2.602 9.288 6.286" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2" style="color: #36454F;">Tidak ada data peminjaman</h3>
          <p class="text-sm opacity-70" style="color: #36454F;">Tidak ada peminjaman yang sesuai dengan kriteria pencarian.</p>
        </div>

        <div v-if="totalPages > 1" class="mt-8">
          <div class="bg-white rounded-xl shadow-lg p-6 border-l-4" style="border-left-color: #00C896;">
            <div class="flex items-center justify-center gap-2 mb-6">
              <svg class="w-5 h-5" style="color: #36454F;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm font-medium" style="color: #36454F;">
                Halaman {{ currentPage }} dari {{ totalPages }} 
                ({{ filteredLoansAlternative.length }} total data)
              </p>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex items-center justify-center gap-4">
              <!-- Previous Button -->
              <button
                @click="goToPrevPage"
                :disabled="!hasPrevPage"
                :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300',
                  hasPrevPage 
                    ? 'text-white hover:shadow-lg hover:scale-105' 
                    : 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-100'
                ]"
                :style="hasPrevPage ? 'background: linear-gradient(135deg, #36454F, #2C3E50);' : ''"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Sebelumnya
              </button>

              <!-- Page Numbers -->
              <div class="flex items-center gap-2">
                <template v-for="page in totalPages" :key="page">
                  <button
                    v-if="page <= 5 || (page >= currentPage - 2 && page <= currentPage + 2) || page > totalPages - 2"
                    @click="goToPage(page)"
                    :class="[
                      'w-10 h-10 rounded-lg font-bold text-sm transition-all duration-300',
                      page === currentPage 
                        ? 'text-white shadow-lg scale-110' 
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200 hover:scale-105'
                    ]"
                    :style="page === currentPage ? 'background: linear-gradient(135deg, #00C896, #00A17C);' : ''"
                  >
                    {{ page }}
                  </button>
                  <span 
                    v-else-if="page === currentPage - 3 || page === currentPage + 3"
                    class="text-gray-400 font-bold"
                  >
                    ...
                  </span>
                </template>
              </div>

              <!-- Next Button -->
              <button
                @click="goToNextPage"
                :disabled="!hasNextPage"
                :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300',
                  hasNextPage 
                    ? 'text-white hover:shadow-lg hover:scale-105' 
                    : 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-100'
                ]"
                :style="hasNextPage ? 'background: linear-gradient(135deg, #36454F, #2C3E50);' : ''"
              >
                Selanjutnya
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- Quick Jump -->
            <div v-if="totalPages > 5" class="mt-4 flex items-center justify-center gap-3">
              <span class="text-sm font-medium" style="color: #36454F;">Lompat ke halaman:</span>
              <select 
                v-model="currentPage" 
                class="px-3 py-1 rounded-lg border-2 border-transparent bg-gray-100 text-sm
                       focus:ring-2 focus:border-transparent transition-all duration-300"
                style="color: #36454F; --tw-ring-color: #00C896;"
              >
                <option v-for="page in totalPages" :key="page" :value="page">
                  {{ page }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="notification.show"
         class="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-xl shadow-2xl border-l-4 transform transition-all duration-500 ease-in-out animate-bounce"
         :style="notification.type === 'success' ? 'border-left-color: #00C896' : 'border-left-color: #ef4444'">
      <div class="p-5">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div v-if="notification.type === 'success'" 
                 class="w-8 h-8 rounded-full flex items-center justify-center"
                 style="background: linear-gradient(135deg, #00C896, #00A17C);">
              <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"/>
              </svg>
            </div>
            <div v-else class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
              <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          <div class="ml-4 w-0 flex-1 pt-0.5">
            <p class="text-sm font-bold" style="color: #36454F;">{{ notification.title }}</p>
            <p class="mt-1 text-sm opacity-70" style="color: #36454F;">{{ notification.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button @click="hideNotification" 
                    class="inline-flex rounded-full p-1.5 transition-colors duration-200 hover:bg-gray-100">
              <svg class="h-5 w-5" style="color: #36454F;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, watchEffect } from 'vue'
import type { LoanModel, UpdateLoanModel } from '../models/loan.model'
import { updateLoan } from '../provider/loan.provider'
import { LoanStatus } from '../models/enums'
import useGetLoans from '../hooks/useGetLoans'
import Loading from './Loading.vue'
import Dropdown from './Dropdown.vue'
import type { AdminModel } from '../models/admin.model'

interface Props {
  showAction?: boolean;
  admin?: AdminModel;
}

const props = withDefaults(defineProps<Props>(), {
  showAction: false,
})

const { loans, isLoading, error } = useGetLoans()
const emit = defineEmits<{
  loanUpdated: [loan: LoanModel]
}>()

const localLoans = ref<LoanModel[]>([])

watchEffect(() => {
  localLoans.value = [...loans.value]
})

const updatingLoanIds = ref(new Set<number>())

const notification = reactive({
  show: false,
  type: 'success' as 'success' | 'error',
  title: '',
  message: ''
})

const search = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredLoansAlternative = computed(() => {
  let filteredLoans = [...localLoans.value];

  if (search.value) {
    const searchTerm = search.value.toLowerCase().trim();
    filteredLoans = filteredLoans.filter((loan) => {
      return loan.borrower.name?.toLowerCase().includes(searchTerm) ||
            loan.loanItems.some(loanItem => 
              loanItem.item.name.toLowerCase().includes(searchTerm)
            );
    });
  }

  if (filterStatus.value) {
    filteredLoans = filteredLoans.filter(loan => loan.loanStatus === filterStatus.value);
  }

  return filteredLoans;
});

const paginatedLoans = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredLoansAlternative.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(filteredLoansAlternative.value.length / itemsPerPage);
});

const hasNextPage = computed(() => {
  return currentPage.value < totalPages.value;
});

const hasPrevPage = computed(() => {
  return currentPage.value > 1;
});

const goToNextPage = () => {
  if (hasNextPage.value) {
    currentPage.value++;
  }
};

const goToPrevPage = () => {
  if (hasPrevPage.value) {
    currentPage.value--;
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Reset page when search or filter changes
watchEffect(() => {
  currentPage.value = 1;
}, { flush: 'post' });

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

const statusChangeOptions = [
  { value: LoanStatus.PENDING, label: 'Pending' },
  { value: LoanStatus.APPROVED, label: 'Disetujui' },
  { value: LoanStatus.ACTIVE, label: 'Aktif' },
  { value: LoanStatus.RETURNED, label: 'Dikembalikan' },
  { value: LoanStatus.OVERDUE, label: 'Terlambat' },
  { value: LoanStatus.CANCELLED, label: 'Ditolak' },
];

const getCurrentStatusOption = (status: LoanStatus) => {
  return statusChangeOptions.find(option => option.value === status) || statusChangeOptions[0];
};

const getStatusText = (status: LoanStatus) => {
  switch (status) {
    case LoanStatus.PENDING:
      return 'Pending'
    case LoanStatus.APPROVED:
      return 'Disetujui'
    case LoanStatus.ACTIVE:
      return 'Aktif'
    case LoanStatus.RETURNED:
      return 'Dikembalikan'
    case LoanStatus.OVERDUE:
      return 'Terlambat'
    case LoanStatus.CANCELLED:
      return 'Ditolak'
    default:
      return status
  }
}

const statusClass = (status: LoanStatus) => {
  const baseClass = 'inline-flex px-3 py-1.5 text-xs font-bold rounded-full shadow-sm';
  switch (status) {
    case LoanStatus.PENDING:
      return `${baseClass} text-white` + ` bg-yellow-500`;
    case LoanStatus.APPROVED:
      return `${baseClass} text-white` + ` bg-green-500`;
    case LoanStatus.ACTIVE:
      return `${baseClass} text-white` + ` bg-blue-500`;
    case LoanStatus.RETURNED:
      return `${baseClass} text-white` + ` bg-gray-500`;
    case LoanStatus.OVERDUE:
      return `${baseClass} text-white` + ` bg-red-500`;
    case LoanStatus.CANCELLED:
      return `${baseClass} text-white` + ` bg-red-600`;
    default:
      return `${baseClass} text-white` + ` bg-gray-400`;
  }
}

const showNotification = (type: 'success' | 'error', title: string, message: string) => {
  notification.show = true
  notification.type = type
  notification.title = title
  notification.message = message
  
  setTimeout(() => {
    hideNotification()
  }, 5000)
}

const hideNotification = () => {
  notification.show = false
}

const updateLoanStatus = async (loan: LoanModel, newStatus: LoanStatus) => {
  if (loan.loanStatus === newStatus) {
    return;
  }

  updatingLoanIds.value.add(loan.id)
  
  try {
    const updatedLoanData: UpdateLoanModel = await updateLoan(loan.id, {
      loanStatus: newStatus,
      approvedById: props.admin?.id || 0,
    })
    
    const loanIndex = localLoans.value.findIndex(l => l.id === loan.id)
    if (loanIndex !== -1) {
      localLoans.value[loanIndex] = {
        ...localLoans.value[loanIndex],
        loanStatus: newStatus
      }
    }
    
    emit('loanUpdated', localLoans.value[loanIndex])
    
    showNotification(
      'success',
      'Berhasil!',
      `Status peminjaman ${loan.borrower.name} berhasil diubah ke ${getStatusText(newStatus)}.`
    )
    
    console.log(`Updated loan ${loan.id} to ${newStatus}`, updatedLoanData)
    
  } catch (error: any) {
    console.error('Error updating loan status:', error)
    
    showNotification(
      'error',
      'Gagal!',
      'Terjadi kesalahan saat memperbarui status peminjaman.'
    )
  } finally {
    updatingLoanIds.value.delete(loan.id)
  }
}
</script>

<style scoped>
/* Custom scrollbar untuk konsistensi */
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

/* Loading animation */
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

/* Bounce animation for toast */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

.animate-bounce {
  animation: bounce 1s ease-in-out;
}
</style>