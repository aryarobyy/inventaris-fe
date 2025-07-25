<template>
  <div class="p-6 bg-primary min-h-screen">
    <div class="bg-second rounded-lg shadow-sm p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Manajemen Item</h1>
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="relative flex-1 max-w-md">
            <input 
              v-model="search" 
              placeholder="Cari nama item atau merek..." 
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
                v-for="option in itemStatusOptions" 
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

      <div v-else>
        <!-- Mobile View -->
        <div class="bg-tertiary block sm:hidden space-y-3">
          <div v-for="(item, itemIndex) in filteredItems" :key="item.id" class="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div class="flex justify-between items-start mb-3">
              <div>
                <div class="flex items-center mb-1">
                  <div class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-2">
                    {{ itemIndex + 1 }}
                  </div>
                  <p class="text-sm text-gray-600">ID: {{ item.id }}</p>
                </div>
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-6 w-6 mr-2">
                    <img 
                      v-if="item.imgUrl" 
                      :src="item.imgUrl" 
                      :alt="item.name"
                      class="h-6 w-6 rounded object-cover"
                    />
                    <div v-else class="h-6 w-6 rounded bg-gray-300 flex items-center justify-center">
                      <span class="text-xs font-medium text-gray-700">{{ getInitials(item.name) }}</span>
                    </div>
                  </div>
                  <p class="font-semibold text-gray-900">{{ item.name }}</p>
                </div>
              </div>
              <span :class="[availabilityStatusClass(item.availabilityStatus)]">{{ getAvailabilityStatusText(item.availabilityStatus) }}</span>
            </div>
            
            <div class="mb-3">
              <p class="text-sm text-gray-600 mb-1">Merek: <span class="font-medium">{{ item.brand || '-' }}</span></p>
              <p class="text-sm text-gray-600 mb-1">Kategori: <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{{ item.category }}</span></p>
              <p class="text-sm text-gray-600 mb-1">Kondisi: <span :class="[conditionStatusClass(item.conditionStatus)]">{{ getConditionStatusText(item.conditionStatus) }}</span></p>
              <p class="text-sm text-gray-600 mb-1">Jumlah: <span class="font-medium">{{ item.quantity }}</span></p>
              <p class="text-sm text-gray-600">Dipinjam: <span class="font-medium">{{ item.borrowedQuantity || 0 }}</span></p>
            </div>
            
            <div class="flex justify-between text-sm text-gray-600 mb-3">
              <p>Dibuat: {{ formatDate(item.createdAt) }}</p>
              <p>Update: {{ formatDate(item.updatedAt) }}</p>
            </div>
            
            <div 
              v-if="canShowActionButtons(item)" 
              class="flex justify-center space-x-2 pt-2 border-t border-gray-200"
            >
              <Button
              :text="updatingItemIds.has(item.id) ? 'Memproses...' : 'Tersedia'"
              :loading="updatingItemIds.has(item.id)"
              :icon="Check"
              icon-position="left"
              :disabled="item.availabilityStatus === ItemAvailability.AVAILABLE || updatingItemIds.has(item.id)"
              size="small"
              variant="accept"
              class="flex-1"
              @click="updateItemAvailability(item, ItemAvailability.AVAILABLE)"
              />

              <Button
              :text="updatingItemIds.has(item.id) ? 'Memproses...' : 'Maintenance'"
              :loading="updatingItemIds.has(item.id)"
              :icon="Settings"
              icon-position="left"
              :disabled="item.availabilityStatus === ItemAvailability.MAINTENANCE || updatingItemIds.has(item.id)"
              size="small"
              variant="reject"
              class="flex-1"
              @click="updateItemAvailability(item, ItemAvailability.MAINTENANCE)"
              />
            </div>
          </div>
        </div>

        <!-- Desktop View -->
        <div class="hidden sm:block">
          <div class="bg-tertiary rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <tr>
                    <th class="p-3 text-left whitespace-nowrap">No</th>
                    <th class="p-3 text-left whitespace-nowrap">ID</th>
                    <th class="p-3 text-left whitespace-nowrap">Item</th>
                    <th class="p-3 text-left whitespace-nowrap">Merek</th>
                    <th class="p-3 text-left whitespace-nowrap">Kategori</th>
                    <th class="p-3 text-left whitespace-nowrap">Kondisi</th>
                    <th class="p-3 text-left whitespace-nowrap">Jumlah</th>
                    <th class="p-3 text-left whitespace-nowrap">Dipinjam</th>
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
                  <tr v-for="(item, itemIndex) in filteredItems" :key="item.id" class="hover:bg-gray-50 transition-colors">
                    <td class="p-3 whitespace-nowrap">
                      <div class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {{ itemIndex + 1 }}
                      </div>
                    </td>
                    <td class="p-3 whitespace-nowrap font-medium">{{ item.id }}</td>
                    <td class="p-3 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-8 w-8">
                          <img 
                            v-if="item.imgUrl" 
                            :src="item.imgUrl" 
                            :alt="item.name"
                            class="h-8 w-8 rounded object-cover"
                          />
                          <div v-else class="h-8 w-8 rounded bg-gray-300 flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-700">{{ getInitials(item.name) }}</span>
                          </div>
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                          <div v-if="item.description" class="text-xs text-gray-500">{{ item.description }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="p-3 whitespace-nowrap">{{ item.brand || '-' }}</td>
                    <td class="p-3 whitespace-nowrap">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {{ item.category }}
                      </span>
                    </td>
                    <td class="p-3 whitespace-nowrap">
                      <span :class="[conditionStatusClass(item.conditionStatus)]">{{ getConditionStatusText(item.conditionStatus) }}</span>
                    </td>
                    <td class="p-3 whitespace-nowrap">{{ item.quantity }}</td>
                    <td class="p-3 whitespace-nowrap">{{ item.borrowedQuantity || 0 }}</td>
                    <td class="p-3 whitespace-nowrap">{{ formatDate(item.createdAt) }}</td>
                    <td class="p-3 whitespace-nowrap">{{ formatDate(item.updatedAt) }}</td>
                    <td class="p-3 whitespace-nowrap text-center">
                      <span :class="[availabilityStatusClass(item.availabilityStatus)]">{{ getAvailabilityStatusText(item.availabilityStatus) }}</span>
                    </td>
                    <td v-if="shouldShowActionColumn" class="p-3 whitespace-nowrap text-center">
                      <!-- Action buttons -->
                      <div 
                        v-if="canShowActionButtons(item)"
                        class="flex justify-center space-x-2"
                      >
                      <Button
                      :text="updatingItemIds.has(item.id) ? 'Memproses...' : 'Tersedia'"
                      :loading="updatingItemIds.has(item.id)"
                      :icon="Check"
                      icon-position="left"
                      :disabled="item.availabilityStatus === ItemAvailability.AVAILABLE || updatingItemIds.has(item.id)"
                      size="small"
                      variant="accept"
                      class="flex-1"
                      @click="updateItemAvailability(item, ItemAvailability.AVAILABLE)"
                      />

                      <Button
                      :text="updatingItemIds.has(item.id) ? 'Memproses...' : 'Maintenance'"
                      :loading="updatingItemIds.has(item.id)"
                      :icon="Settings"
                      icon-position="left"
                      :disabled="item.availabilityStatus === ItemAvailability.MAINTENANCE || updatingItemIds.has(item.id)"
                      size="small"
                      variant="reject"
                      class="flex-1"
                      @click="updateItemAvailability(item, ItemAvailability.MAINTENANCE)"
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

        <div v-if="filteredItems.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8-4-8 4m16 0v10l-8 4-8-4V7m16 10L12 17l-8-4m16 4v10l-8 4-8-4V17" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada data item</h3>
          <p class="mt-1 text-sm text-gray-500">Tidak ada item yang sesuai dengan kriteria pencarian.</p>
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
import { ref, computed, reactive, onMounted } from 'vue'
import type { ItemModel } from '../models/item.model'
import { Check, Settings, X } from 'lucide-vue-next'
import { ItemAvailability, ItemCondition } from '../models/enums'
import { getItems, updateItem } from '../provider/item.provider'
import Button from './Button.vue'

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
  itemUpdated: [item: ItemModel]
}>()

const localItems = ref<ItemModel[]>([])
const updatingItemIds = ref(new Set<number>())

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
    const data = await getItems()
    localItems.value = data
  } catch (error) {
    console.error('Error loading items:', error)
  }
})
console.log('Mounted and items loaded:', localItems.value)

const filteredItems = computed(() => {
  if (!search.value && !filterStatus.value) {
    return localItems.value
  }

  return localItems.value.filter((item) => {
    const searchTerm = search.value.toLowerCase().trim()
    
    const searchMatch = !searchTerm || 
      item.name?.toLowerCase().includes(searchTerm) ||
      item.brand?.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm)
    
    let statusMatch = true
    if (filterStatus.value) {
      if (filterStatus.value === ItemAvailability.AVAILABLE) {
        statusMatch = item.availabilityStatus === ItemAvailability.AVAILABLE
      } else if (filterStatus.value === ItemAvailability.BORROWED) {
        statusMatch = item.availabilityStatus === ItemAvailability.BORROWED
      } else if (filterStatus.value === ItemAvailability.MAINTENANCE) {
        statusMatch = item.availabilityStatus === ItemAvailability.MAINTENANCE
      } else if (filterStatus.value === ItemAvailability.RETIRED) {
        statusMatch = item.availabilityStatus === ItemAvailability.RETIRED
      } else {
        statusMatch = item.conditionStatus === filterStatus.value
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
    localItems.value.some(item => canShowActionButtons(item))
})

const canShowActionButtons = (item: ItemModel): boolean => {
  if (!isSuperAdmin.value || !props.showAction) {
    return false
  }
  
  return true
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

const itemStatusOptions = [
  { value: '', label: 'Semua Status' },
  { value: ItemAvailability.AVAILABLE, label: 'Tersedia' },
  { value: ItemAvailability.BORROWED, label: 'Dipinjam' },
  { value: ItemAvailability.MAINTENANCE, label: 'Maintenance' },
  { value: ItemAvailability.RETIRED, label: 'Retired' },
  { value: ItemCondition.GOOD, label: 'Kondisi Baik' },
  { value: ItemCondition.DAMAGED, label: 'Kondisi Rusak' },
  { value: ItemCondition.REPAIR, label: 'Kondisi Repair' },
  { value: ItemCondition.LOST, label: 'Kondisi Hilang' },
]

const getAvailabilityStatusText = (status: string) => {
  switch (status) {
    case ItemAvailability.AVAILABLE: return 'Tersedia'
    case ItemAvailability.BORROWED: return 'Dipinjam'
    case ItemAvailability.MAINTENANCE: return 'Maintenance'
    case ItemAvailability.RETIRED: return 'Retired'
    default: return status
  }
}

const getConditionStatusText = (status: string) => {
  switch (status) {
    case ItemCondition.GOOD: return 'Baik'
    case ItemCondition.DAMAGED: return 'Rusak'
    case ItemCondition.REPAIR: return 'Repair'
    case ItemCondition.LOST: return 'Hilang'
    default: return status
  }
}

const availabilityStatusClass = (status: string) => {
  const baseClass = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
  switch (status) {
    case ItemAvailability.AVAILABLE:
      return `${baseClass} bg-green-100 text-green-800`
    case ItemAvailability.BORROWED:
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case ItemAvailability.MAINTENANCE:
      return `${baseClass} bg-orange-100 text-orange-800`
    case ItemAvailability.RETIRED:
      return `${baseClass} bg-gray-100 text-gray-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const conditionStatusClass = (status: string) => {
  const baseClass = 'inline-flex px-2 py-0.5 rounded-full text-xs font-medium'
  switch (status) {
    case ItemCondition.GOOD:
      return `${baseClass} bg-green-100 text-green-800`
    case ItemCondition.DAMAGED:
      return `${baseClass} bg-red-100 text-red-800`
    case ItemCondition.REPAIR:
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case ItemCondition.LOST:
      return `${baseClass} bg-gray-100 text-gray-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
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

const updateItemAvailability = async (item: ItemModel, newStatus: ItemAvailability) => {
  updatingItemIds.value.add(item.id)
  
  try {
    const updatedItemData = await updateItem(item.id, {
      availabilityStatus: newStatus
    })
    
    const itemIndex = localItems.value.findIndex(i => i.id === item.id)
    if (itemIndex !== -1) {
      localItems.value[itemIndex] = {
        ...localItems.value[itemIndex],
        availabilityStatus: newStatus
      }
    }
    
    emit('itemUpdated', localItems.value[itemIndex])
    
    const statusText = newStatus === ItemAvailability.AVAILABLE ? 'tersedia' : 
                      newStatus === ItemAvailability.MAINTENANCE ? 'dalam maintenance' :
                      newStatus === ItemAvailability.BORROWED ? 'dipinjam' : 
                      newStatus === ItemAvailability.RETIRED ? 'retired' : newStatus
    showNotification(
      'success',
      'Berhasil!',
      `Item ${item.name} berhasil diubah menjadi ${statusText}.`
    )
    
    console.log(`Updated item ${item.id} to ${newStatus}`, updatedItemData)
    
  } catch (error: any) {
    console.error('Error updating item availability:', error)
    
    showNotification(
      'error',
      'Gagal!',
      'Terjadi kesalahan saat memperbarui status item.'
    )
  } finally {
    updatingItemIds.value.delete(item.id)
  }
}
</script>