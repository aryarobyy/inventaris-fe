<template>
  <div class="p-6 bg-primary min-h-screen">
    <div class="bg-second rounded-lg shadow-sm p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Manajemen Peminjaman</h1>
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between ">
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
      <Loading v-if="isLoading" :isLoading="isLoading" />

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error memuat data</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      </div>

      <div v-else>
        <!-- Mobile View -->
        <div class="bg-tertiary block sm:hidden space-y-3">
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
            
            <div v-if="props.showAction" class="flex justify-center pt-2 border-t border-gray-200">
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
          <div class="bg-tertiary rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal w-full">
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
                        <div v-for="item in loan.loanItems" :key="item.item.id" class="items-center">
                          <span class="text-sm">• {{ item.item.name }}</span>
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-5">
                            {{ item.borrowedQuantity }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td class="p-3 whitespace-nowrap">{{ formatDate(loan.loanDate) }}</td>
                    <td class="p-3 whitespace-nowrap">{{ formatDate(loan.dueDate) }}</td>
                    <td class="p-3 whitespace-nowrap flex text-center justify-center">
                      <span :class="[statusClass(loan.loanStatus)]">{{ getStatusText(loan.loanStatus) }}</span>
                    </td>
                    <td class="p-3 whitespace-nowrap text-center">
                      <div v-if="props.showAction" class="flex justify-center">
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

    <!-- Success/Error Toast Notifications -->
    <div v-if="notification.show" 
         class="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 transform transition-all duration-300 ease-in-out"
         :class="notification.type === 'success' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'">
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg v-if="notification.type === 'success'" class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
            <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button @click="hideNotification" class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
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
  admin: AdminModel;
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
  // } else {
  //   filteredLoans = filteredLoans.filter(loan => 
  //     loan.loanStatus !== LoanStatus.RETURNED && 
  //     loan.loanStatus !== LoanStatus.CANCELLED
  //   );
  }

  // const today = new Date();
  // today.setHours(0, 0, 0, 0); 
  // filteredLoans.sort((a, b) => {
  //   const dateA = new Date(a.loanDate);
  //   const dateB = new Date(b.loanDate);
    
  //   dateA.setHours(0, 0, 0, 0);
  //   dateB.setHours(0, 0, 0, 0);
    
  //   const diffA = Math.abs(dateA.getTime() - today.getTime());
  //   const diffB = Math.abs(dateB.getTime() - today.getTime());
    
  //   return diffA - diffB; 
  // });

  return filteredLoans;
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
  const baseClass = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full';
  switch (status) {
    case LoanStatus.PENDING:
      return `${baseClass} bg-yellow-100 text-yellow-800`;
    case LoanStatus.APPROVED:
      return `${baseClass} bg-green-100 text-green-800`;
    case LoanStatus.ACTIVE:
      return `${baseClass} bg-blue-100 text-blue-800`;
    case LoanStatus.RETURNED:
      return `${baseClass} bg-gray-100 text-gray-800`;
    case LoanStatus.OVERDUE:
      return `${baseClass} bg-red-100 text-red-800`;
    case LoanStatus.CANCELLED:
      return `${baseClass} bg-red-100 text-red-800`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800`;
  }
}

// const getStatusSelectClass = (status: LoanStatus) => {
//   switch (status) {
//     case LoanStatus.PENDING:
//       return 'text-yellow-800';
//     case LoanStatus.APPROVED:
//       return 'text-green-800';
//     case LoanStatus.ACTIVE:
//       return 'text-blue-800';
//     case LoanStatus.RETURNED:
//       return 'text-gray-800';
//     case LoanStatus.OVERDUE:
//       return 'text-red-800';
//     case LoanStatus.CANCELLED:
//       return 'text-red-800';
//     default:
//       return 'text-gray-800';
//   }
// }

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
    const updatedLoanData : UpdateLoanModel= await updateLoan(loan.id, {
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