<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Manajemen Admin</h1>
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="relative flex-1 max-w-md">
            <input 
              v-model="search" 
              placeholder="Cari username atau nama admin..." 
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
                v-for="option in adminStatusOptions" 
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
          <div v-for="(admin, adminIndex) in filteredAdmins" :key="admin.id" class="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div class="flex justify-between items-start mb-3">
              <div>
                <div class="flex items-center mb-1">
                  <div class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-2">
                    {{ adminIndex + 1 }}
                  </div>
                  <p class="text-sm text-gray-600">ID: {{ admin.id }}</p>
                </div>
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-6 w-6 mr-2">
                    <div class="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-xs font-medium text-gray-700">{{ getInitials(admin.name) }}</span>
                    </div>
                  </div>
                  <p class="font-semibold text-gray-900">{{ admin.name }}</p>
                </div>
              </div>
              <span :class="[statusClass(admin.status)]">{{ getStatusText(admin.status) }}</span>
            </div>
            
            <div class="mb-3">
              <p class="text-sm text-gray-600 mb-1">Username: <span class="font-medium">{{ admin.username }}</span></p>
              <p class="text-sm text-gray-600">Role: <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{{ admin.role }}</span></p>
            </div>
            
            <div class="flex justify-between text-sm text-gray-600 mb-3">
              <p>Dibuat: {{ formatDate(admin.createdAt) }}</p>
              <p>Update: {{ formatDate(admin.updatedAt) }}</p>
            </div>
            
            <div 
              v-if="canShowStatusButtons(admin)" 
              class="flex justify-center space-x-2 pt-2 border-t border-gray-200"
            >
              <Button
                :text="updatingAdminIds.has(admin.id) ? 'Memproses...' : 'Aktifkan'"
                :loading="updatingAdminIds.has(admin.id)"
                :icon="Check"
                icon-position="left"
                :disabled="admin.status === true || updatingAdminIds.has(admin.id)"
                size="small"
                variant="accept"
                @click="updateAdminStatus(admin, true)"
                class="flex-1"
              />
              <Button
                :text="updatingAdminIds.has(admin.id) ? 'Memproses...' : 'Nonaktifkan'"
                :loading="updatingAdminIds.has(admin.id)"
                :icon="X"
                icon-position="left"
                :disabled="admin.status === false || updatingAdminIds.has(admin.id)"
                size="small"
                variant="reject"
                @click="updateAdminStatus(admin, false)"
                class="flex-1"
              />
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
                    <th class="p-3 text-left whitespace-nowrap">Admin</th>
                    <th class="p-3 text-left whitespace-nowrap">Username</th>
                    <th class="p-3 text-left whitespace-nowrap">Role</th>
                    <th class="p-3 text-left whitespace-nowrap">Tgl Dibuat</th>
                    <th class="p-3 text-left whitespace-nowrap">Tgl Update</th>
                    <th class="p-3 text-center whitespace-nowrap">Status</th>
                    <th 
                      v-if="shouldShowActionColumn"
                      class="p-3 text-center whitespace-nowrap"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody class="text-gray-700 text-sm divide-y divide-gray-200">
                  <tr v-for="(admin, adminIndex) in filteredAdmins" :key="admin.id" class="hover:bg-gray-50 transition-colors">
                    <td class="p-3 whitespace-nowrap">
                      <div class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {{ adminIndex + 1 }}
                      </div>
                    </td>
                    <td class="p-3 whitespace-nowrap font-medium">{{ admin.id }}</td>
                    <td class="p-3 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-8 w-8">
                          <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-700">{{ getInitials(admin.name) }}</span>
                          </div>
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">{{ admin.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="p-3 whitespace-nowrap">{{ admin.username }}</td>
                    <td class="p-3 whitespace-nowrap">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {{ admin.role }}
                      </span>
                    </td>
                    <td class="p-3 whitespace-nowrap">{{ formatDate(admin.createdAt) }}</td>
                    <td class="p-3 whitespace-nowrap">{{ formatDate(admin.updatedAt) }}</td>
                    <td class="p-3 whitespace-nowrap text-center">
                      <span :class="[statusClass(admin.status)]">{{ getStatusText(admin.status) }}</span>
                    </td>
                    <td v-if="shouldShowActionColumn" class="p-3 whitespace-nowrap text-center">
                      <div 
                        v-if="canShowStatusButtons(admin)"
                        class="flex justify-center space-x-2"
                      >
                        <Button
                          :text="updatingAdminIds.has(admin.id) ? 'Memproses...' : 'Aktifkan'"
                          :loading="updatingAdminIds.has(admin.id)"
                          :icon="Check"
                          icon-position="left"
                          :disabled="admin.status === true || updatingAdminIds.has(admin.id)"
                          size="small"
                          variant="accept"
                          @click="updateAdminStatus(admin, true)"
                        />
                        <Button
                          :text="updatingAdminIds.has(admin.id) ? 'Memproses...' : 'Nonaktifkan'"
                          :loading="updatingAdminIds.has(admin.id)"
                          :icon="X"
                          icon-position="left"
                          :disabled="admin.status === false || updatingAdminIds.has(admin.id)"
                          size="small"
                          variant="reject"
                          @click="updateAdminStatus(admin, false)"
                        />
                      </div>
                      <div v-else class="text-sm text-gray-400">-</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredAdmins.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4c0-1.313.253-2.6.712-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.814 2.602 9.288 6.286" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada data admin</h3>
          <p class="mt-1 text-sm text-gray-500">Tidak ada admin yang sesuai dengan kriteria pencarian.</p>
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
  const baseClass = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
  if (status) {
    return `${baseClass} bg-green-100 text-green-800`
  } else {
    return `${baseClass} bg-red-100 text-red-800`
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