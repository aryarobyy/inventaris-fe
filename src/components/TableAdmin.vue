<template>
  <div class="p-6 min-h-screen" style="background: linear-gradient(135deg, #DFDFDF 0%, #FFFFFF 100%);">
    <div class="rounded-xl shadow-lg p-6" style="background-color: #FFEB3B;">
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-4" style="color: #36454F;">Manajemen Admin</h1>

        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="relative flex-1 max-w-md">
            <input
              v-model="search"
              placeholder="Cari username atau nama admin..."
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
            <option v-for="option in adminStatusOptions" :key="option.value" :value="option.value">
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
          <div v-for="(admin, adminIndex) in filteredAdmins" :key="admin.id"
               class="bg-white rounded-xl shadow-lg p-5 border-l-4 hover:shadow-xl transition-all duration-300"
               style="border-left-color: #00C896;">
            <div class="flex justify-between items-start mb-4">
              <div>
                <div class="flex items-center mb-2">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-3 text-white"
                       style="background: linear-gradient(135deg, #00C896, #00A17C);">
                    {{ adminIndex + 1 }}
                  </div>
                  <p class="text-sm opacity-70" style="color: #36454F;">ID: {{ admin.id }}</p>
                </div>

                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 mr-3">
                    <div class="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold"
                         style="background: linear-gradient(135deg, #36454F, #2C3E50);">
                      <span class="text-sm">{{ getInitials(admin.name) }}</span>
                    </div>
                  </div>
                  <p class="font-bold" style="color: #36454F;">{{ admin.name }}</p>
                </div>
              </div>

              <span :class="[statusClass(admin.status)]">{{ getStatusText(admin.status) }}</span>
            </div>

            <div class="mb-4">
              <div class="space-y-2">
                <div class="flex justify-between items-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                  <span class="text-sm font-medium" style="color: #36454F;">Username</span>
                  <span class="text-sm font-bold" style="color: #36454F;">{{ admin.username }}</span>
                </div>
                <div class="flex justify-between items-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                  <span class="text-sm font-medium" style="color: #36454F;">Role</span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white"
                        style="background: linear-gradient(135deg, #FFEB3B, #F57C00); color: #36454F;">
                    {{ admin.role }}
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
              <div class="text-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                <p class="font-medium" style="color: #36454F;">Dibuat</p>
                <p class="text-xs opacity-70" style="color: #36454F;">{{ formatDate(admin.createdAt) }}</p>
              </div>
              <div class="text-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                <p class="font-medium" style="color: #36454F;">Update</p>
                <p class="text-xs opacity-70" style="color: #36454F;">{{ formatDate(admin.updatedAt) }}</p>
              </div>
            </div>

            <div v-if="canShowStatusButtons(admin)" class="flex justify-center gap-2 pt-3 border-t" style="border-color: #DFDFDF;">
              <button
                @click="updateAdminStatus(admin, true)"
                :disabled="admin.status === true || updatingAdminIds.has(admin.id)"
                class="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                style="background: linear-gradient(135deg, #00C896, #00A17C);"
              >
                {{ updatingAdminIds.has(admin.id) ? 'Memproses...' : 'Aktifkan' }}
              </button>
              <button
                @click="updateAdminStatus(admin, false)"
                :disabled="admin.status === false || updatingAdminIds.has(admin.id)"
                class="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                style="background: linear-gradient(135deg, #36454F, #2C3E50);"
              >
                {{ updatingAdminIds.has(admin.id) ? 'Memproses...' : 'Nonaktifkan' }}
              </button>
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
                    <th class="p-4 text-left whitespace-nowrap">ID</th>
                    <th class="p-4 text-left whitespace-nowrap">Admin</th>
                    <th class="p-4 text-left whitespace-nowrap">Username</th>
                    <th class="p-4 text-left whitespace-nowrap">Role</th>
                    <th class="p-4 text-left whitespace-nowrap">Tgl Dibuat</th>
                    <th class="p-4 text-left whitespace-nowrap">Tgl Update</th>
                    <th class="p-4 text-center whitespace-nowrap">Status</th>
                    <th v-if="shouldShowActionColumn" class="p-4 text-center whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>

                <tbody class="text-white text-sm" style="background-color: #36454F;">
                  <tr v-for="(admin, adminIndex) in filteredAdmins" :key="admin.id"
                      class="transition-all duration-300 hover:bg-white/10 border-b border-white/10">
                    <td class="p-4 text-center">
                      <div class="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold text-white"
                           style="background: linear-gradient(135deg, #00C896, #00A17C);">
                        {{ adminIndex + 1 }}
                      </div>
                    </td>

                    <td class="p-4 whitespace-nowrap font-bold">{{ admin.id }}</td>

                    <td class="p-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 mr-3">
                          <div class="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                               style="background: linear-gradient(135deg, #FFEB3B, #F57C00); color: #36454F;">
                            <span class="text-sm">{{ getInitials(admin.name) }}</span>
                          </div>
                        </div>
                        <div>
                          <div class="text-sm font-bold text-white">{{ admin.name }}</div>
                        </div>
                      </div>
                    </td>

                    <td class="p-4 whitespace-nowrap text-white font-medium">{{ admin.username }}</td>

                    <td class="p-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold"
                            style="background: linear-gradient(135deg, #FFEB3B, #F57C00); color: #36454F;">
                        {{ admin.role }}
                      </span>
                    </td>

                    <td class="p-4 whitespace-nowrap text-white font-medium">{{ formatDate(admin.createdAt) }}</td>
                    <td class="p-4 whitespace-nowrap text-white font-medium">{{ formatDate(admin.updatedAt) }}</td>

                    <td class="p-4 whitespace-nowrap text-center">
                      <span :class="[statusClass(admin.status)]">{{ getStatusText(admin.status) }}</span>
                    </td>

                    <td class="p-4 whitespace-nowrap text-center" v-if="shouldShowActionColumn">
                      <div v-if="canShowStatusButtons(admin)" class="flex justify-center gap-2">
                        <button
                          @click="updateAdminStatus(admin, true)"
                          :disabled="admin.status === true || updatingAdminIds.has(admin.id)"
                          class="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                          style="background: linear-gradient(135deg, #00C896, #00A17C);"
                        >
                          {{ updatingAdminIds.has(admin.id) ? 'Loading...' : 'Aktifkan' }}
                        </button>
                        <button
                          @click="updateAdminStatus(admin, false)"
                          :disabled="admin.status === false || updatingAdminIds.has(admin.id)"
                          class="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                          style="background: linear-gradient(135deg, #36454F, #2C3E50);"
                        >
                          {{ updatingAdminIds.has(admin.id) ? 'Loading...' : 'Nonaktifkan' }}
                        </button>
                      </div>
                      <div v-else class="text-sm text-white/40">-</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredAdmins.length === 0" class="text-center py-16">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
               style="background: linear-gradient(135deg, #36454F, #2C3E50);">
            <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4c0-1.313.253-2.6.712-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.814 2.602 9.288 6.286" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2" style="color: #36454F;">Tidak ada data admin</h3>
          <p class="text-sm opacity-70" style="color: #36454F;">Tidak ada admin yang sesuai dengan kriteria pencarian.</p>
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
import { ref, computed, reactive, watchEffect, onMounted } from 'vue'
import type { AdminModel } from '../models/admin.model'
import { getAdmins, updateAdmin } from '../provider/admin.provider'
import { Check, X } from 'lucide-vue-next'
import Button from './Button.vue'
import Loading from './Loading.vue'

interface Props {
  showAction?: boolean
  isLoading?: boolean
  error?: string | null
  currentUserRole?: string 
}

const props = withDefaults(defineProps<Props>(), {
  showAction: true,
  isLoading: false,
  error: null,
  currentUserRole: 'super_admin'
})

const emit = defineEmits<{
  adminUpdated: [admin: AdminModel]
}>()

const localAdmins = ref<AdminModel[]>([])
const updatingAdminIds = ref(new Set<number>())

const notification = reactive({
  show: false,
  type: 'success' as 'success' | 'error',
  title: '',
  message: ''
})

const search = ref('')
const filterStatus = ref('')

onMounted(async () => {
  try {
    const data = await getAdmins()
    localAdmins.value = data
  } catch (error: any) {
    console.error('Error loading admins:', error)
  }
})

const filteredAdmins = computed(() => {
  if (!search.value && !filterStatus.value) {
    return localAdmins.value
  }

  return localAdmins.value.filter((admin) => {
    const searchTerm = search.value.toLowerCase().trim()
    
    const searchMatch = !searchTerm || 
      admin.name?.toLowerCase().includes(searchTerm) ||
      admin.username?.toLowerCase().includes(searchTerm)
    
    let statusMatch = true
    if (filterStatus.value) {
      if (filterStatus.value === 'active') {
        statusMatch = admin.status === true
      } else if (filterStatus.value === 'inactive') {
        statusMatch = admin.status === false
      } else {
        statusMatch = admin.role === filterStatus.value
      }
    }
    
    return searchMatch && statusMatch
  })
})

const isSuperAdmin = computed(() => {
  return props.currentUserRole === 'super_admin'
})

const shouldShowActionColumn = computed(() => {
  return props.showAction && isSuperAdmin.value && 
    localAdmins.value.some(admin => canShowStatusButtons(admin))
})

const canShowStatusButtons = (admin: AdminModel): boolean => {
  if (!isSuperAdmin.value || !props.showAction) {
    return false
  }
  
  return admin.role === 'pending' || admin.role === 'admin'
}

const getInitials = (name: string) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const adminStatusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'active', label: 'Status Aktif' },
  { value: 'inactive', label: 'Status Nonaktif' },
]

const getStatusText = (status: boolean) => {
  return status ? 'Aktif' : 'Nonaktif'
}

const statusClass = (status: boolean) => {
  const baseClass = 'inline-flex px-3 py-1.5 text-xs font-bold rounded-full shadow-sm'
  if (status) {
    return `${baseClass} text-white bg-green-500`
  } else {
    return `${baseClass} text-white bg-red-500`
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

const updateAdminStatus = async (admin: AdminModel, newStatus: boolean) => {
  updatingAdminIds.value.add(admin.id)
  
  try {
    const updatedAdminData = await updateAdmin(admin.id, {
      role: 'admin',
      status: newStatus
    })
    
    const adminIndex = localAdmins.value.findIndex(a => a.id === admin.id)
    if (adminIndex !== -1) {
      localAdmins.value[adminIndex] = {
        ...localAdmins.value[adminIndex],
        status: newStatus
      }
    }
    
    emit('adminUpdated', localAdmins.value[adminIndex])
    
    const statusText = newStatus ? 'diaktifkan' : 'dinonaktifkan'
    showNotification(
      'success',
      'Berhasil!',
      `Admin ${admin.name} berhasil ${statusText}.`
    )
    
    console.log(`Updated admin ${admin.id} to ${newStatus}`, updatedAdminData)
    
  } catch (error: any) {
    console.error('Error updating admin status:', error)
    
    showNotification(
      'error',
      'Gagal!',
      'Terjadi kesalahan saat memperbarui status admin.'
    )
  } finally {
    updatingAdminIds.value.delete(admin.id)
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