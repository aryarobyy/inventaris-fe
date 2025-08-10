<template>
  <div class="p-6 min-h-screen" style="background: linear-gradient(135deg, #DFDFDF 0%, #FFFFFF 100%);">
    <div class="rounded-xl shadow-lg p-6" style="background-color: #FFEB3B;">
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-4" style="color: #36454F;">Manajemen Item</h1>

        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="relative flex-1 max-w-md">
            <input
              v-model="search"
              placeholder="Cari nama item atau merek..."
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
            <option v-for="option in itemStatusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

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
          <div v-for="(item, itemIndex) in filteredItems" :key="item.id"
               class="bg-white rounded-xl shadow-lg p-5 border-l-4 hover:shadow-xl transition-all duration-300"
               style="border-left-color: #00C896;">
            <div class="flex justify-between items-start mb-4">
              <div>
                <div class="flex items-center mb-2">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-3 text-white"
                       style="background: linear-gradient(135deg, #00C896, #00A17C);">
                    {{ itemIndex + 1 }}
                  </div>
                  <p class="text-sm opacity-70" style="color: #36454F;">ID: {{ item.id }}</p>
                </div>

                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 mr-3">
                    <img 
                      v-if="item.imgUrl" 
                      :src="item.imgUrl" 
                      :alt="item.name"
                      class="h-8 w-8 rounded-full object-cover"
                    />
                    <div v-else class="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold"
                         style="background: linear-gradient(135deg, #36454F, #2C3E50);">
                      <span class="text-sm">{{ getInitials(item.name) }}</span>
                    </div>
                  </div>
                  <p class="font-bold" style="color: #36454F;">{{ item.name }}</p>
                </div>
              </div>

              <span :class="[availabilityStatusClass(item.availabilityStatus)]">{{ getAvailabilityStatusText(item.availabilityStatus) }}</span>
            </div>

            <div class="mb-4">
              <div class="space-y-2">
                <div class="flex justify-between items-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                  <span class="text-sm font-medium" style="color: #36454F;">Merek</span>
                  <span class="text-sm font-bold" style="color: #36454F;">{{ item.brand || '-' }}</span>
                </div>
                <div class="flex justify-between items-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                  <span class="text-sm font-medium" style="color: #36454F;">Kategori</span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white"
                        style="background: linear-gradient(135deg, #FFEB3B, #F57C00); color: #36454F;">
                    {{ getCategoryItem(item.category) }}
                  </span>
                </div>
                <div class="flex justify-between items-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                  <span class="text-sm font-medium" style="color: #36454F;">Kondisi</span>
                  <span :class="[conditionStatusClass(item.conditionStatus)]">{{ getConditionStatusText(item.conditionStatus) }}</span>
                </div>
                <div class="flex justify-between items-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                  <span class="text-sm font-medium" style="color: #36454F;">Stock / Dipinjam</span>
                  <span class="text-sm font-bold" style="color: #36454F;">{{ item.stock }} / {{ item.borrowedQuantity || 0 }}</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
              <div class="text-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                <p class="font-medium" style="color: #36454F;">Dibuat</p>
                <p class="text-xs opacity-70" style="color: #36454F;">{{ formatDate(item.createdAt) }}</p>
              </div>
              <div class="text-center p-2 rounded-lg" style="background-color: #DFDFDF;">
                <p class="font-medium" style="color: #36454F;">Update</p>
                <p class="text-xs opacity-70" style="color: #36454F;">{{ formatDate(item.updatedAt) }}</p>
              </div>
            </div>

            <div v-if="canShowActionButtons(item)" class="flex justify-center gap-2 pt-3 border-t" style="border-color: #DFDFDF;">
              <button
                @click="updateItemAvailability(item, ItemAvailability.AVAILABLE)"
                :disabled="item.availabilityStatus === ItemAvailability.AVAILABLE || updatingItemIds.has(item.id)"
                class="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                style="background: linear-gradient(135deg, #00C896, #00A17C);"
              >
                {{ updatingItemIds.has(item.id) ? 'Memproses...' : 'Tersedia' }}
              </button>
              <button
                @click="updateItemAvailability(item, ItemAvailability.MAINTENANCE)"
                :disabled="item.availabilityStatus === ItemAvailability.MAINTENANCE || updatingItemIds.has(item.id)"
                class="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                style="background: linear-gradient(135deg, #36454F, #2C3E50);"
              >
                {{ updatingItemIds.has(item.id) ? 'Memproses...' : 'Maintenance' }}
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
                    <th class="p-4 text-left whitespace-nowrap">Item</th>
                    <th class="p-4 text-left whitespace-nowrap">Merek</th>
                    <th class="p-4 text-left whitespace-nowrap">Kategori</th>
                    <th class="p-4 text-left whitespace-nowrap">Kondisi</th>
                    <th class="p-4 text-left whitespace-nowrap">Stock</th>
                    <th class="p-4 text-left whitespace-nowrap">Dipinjam</th>
                    <th class="p-4 text-left whitespace-nowrap">Tgl Dibuat</th>
                    <th class="p-4 text-left whitespace-nowrap">Tgl Update</th>
                    <th class="p-4 text-center whitespace-nowrap">Status</th>
                    <th v-if="shouldShowActionColumn" class="p-4 text-center whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>

                <tbody class="text-white text-sm" style="background-color: #36454F;">
                  <tr v-for="(item, itemIndex) in filteredItems" :key="item.id"
                      class="transition-all duration-300 hover:bg-white/10 border-b border-white/10">
                    <td class="p-4 text-center">
                      <div class="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold text-white"
                           style="background: linear-gradient(135deg, #00C896, #00A17C);">
                        {{ itemIndex + 1 }}
                      </div>
                    </td>

                    <td class="p-4 whitespace-nowrap font-bold">{{ item.id }}</td>

                    <td class="p-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 mr-3">
                          <img 
                            v-if="item.imgUrl" 
                            :src="item.imgUrl" 
                            :alt="item.name"
                            class="h-10 w-10 rounded-full object-cover"
                          />
                          <div v-else class="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                               style="background: linear-gradient(135deg, #FFEB3B, #F57C00); color: #36454F;">
                            <span class="text-sm">{{ getInitials(item.name) }}</span>
                          </div>
                        </div>
                        <div>
                          <div class="text-sm font-bold text-white">{{ item.name }}</div>
                          <div v-if="item.description" class="text-xs text-white/70">{{ item.description }}</div>
                        </div>
                      </div>
                    </td>

                    <td class="p-4 whitespace-nowrap text-white font-medium">{{ item.brand || '-' }}</td>

                    <td class="p-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold"
                            style="background: linear-gradient(135deg, #FFEB3B, #F57C00); color: #36454F;">
                        {{ getCategoryItem(item.category) }}
                      </span>
                    </td>

                    <td class="p-4 whitespace-nowrap">
                      <span :class="[conditionStatusClass(item.conditionStatus)]">{{ getConditionStatusText(item.conditionStatus) }}</span>
                    </td>

                    <td class="p-4 whitespace-nowrap text-white font-medium">{{ item.stock }}</td>
                    <td class="p-4 whitespace-nowrap text-white font-medium">{{ item.borrowedQuantity || 0 }}</td>
                    <td class="p-4 whitespace-nowrap text-white font-medium">{{ formatDate(item.createdAt) }}</td>
                    <td class="p-4 whitespace-nowrap text-white font-medium">{{ formatDate(item.updatedAt) }}</td>

                    <td class="p-4 whitespace-nowrap text-center">
                      <span :class="[availabilityStatusClass(item.availabilityStatus)]">{{ getAvailabilityStatusText(item.availabilityStatus) }}</span>
                    </td>

                    <td class="p-4 whitespace-nowrap text-center" v-if="shouldShowActionColumn">
                      <div v-if="canShowActionButtons(item)" class="flex justify-center gap-2">
                        <button
                          @click="updateItemAvailability(item, ItemAvailability.AVAILABLE)"
                          :disabled="item.availabilityStatus === ItemAvailability.AVAILABLE || updatingItemIds.has(item.id)"
                          class="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                          style="background: linear-gradient(135deg, #00C896, #00A17C);"
                        >
                          {{ updatingItemIds.has(item.id) ? 'Loading...' : 'Tersedia' }}
                        </button>
                        <button
                          @click="updateItemAvailability(item, ItemAvailability.MAINTENANCE)"
                          :disabled="item.availabilityStatus === ItemAvailability.MAINTENANCE || updatingItemIds.has(item.id)"
                          class="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                          style="background: linear-gradient(135deg, #7D0A0A, #E43636);"
                        >
                          {{ updatingItemIds.has(item.id) ? 'Loading...' : 'Maintenance' }}
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
        <div v-if="filteredItems.length === 0" class="text-center py-16">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
               style="background: linear-gradient(135deg, #36454F, #2C3E50);">
            <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8-4-8 4m16 0v10l-8 4-8-4V7m16 10L12 17l-8-4m16 4v10l-8 4-8-4V17" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2" style="color: #36454F;">Tidak ada data item</h3>
          <p class="text-sm opacity-70" style="color: #36454F;">Tidak ada item yang sesuai dengan kriteria pencarian.</p>
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
import { ref, computed, reactive, onMounted } from 'vue'
import type { ItemModel } from '../models/item.model'
import { Check, Settings, X } from 'lucide-vue-next'
import { ItemAvailability, ItemCategory, ItemCondition, Role } from '../models/enums'
import { getItems, updateItem } from '../provider/item.provider'
import Button from './Button.vue'
import Loading from './Loading.vue'

interface Props {
  showAction: boolean
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
  return props.currentUserRole === Role.SUPER_ADMIN
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
  const baseClass = 'inline-flex px-3 py-1.5 text-xs font-bold rounded-full shadow-sm'
  switch (status) {
    case ItemAvailability.AVAILABLE:
      return `${baseClass} text-white bg-green-500`
    case ItemAvailability.BORROWED:
      return `${baseClass} text-white bg-yellow-500`
    case ItemAvailability.MAINTENANCE:
      return `${baseClass} text-white bg-red-500`
    case ItemAvailability.RETIRED:
      return `${baseClass} text-white bg-gray-500`
    default:
      return `${baseClass} text-white bg-gray-400`
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

const getCategoryItem = (category: string) => {
  switch (category) {
    case ItemCategory.CABLE:
      return 'Kabel'
    case ItemCategory.COMPUTER:
      return 'Komputer'
    case ItemCategory.HEADSET:
      return 'Headset'
    case ItemCategory.KEYBOARD:
      return 'Keyboard'
    case ItemCategory.LAPTOP:
      return 'Laptop'
    case ItemCategory.MONITOR:
      return 'Monitor'
    case ItemCategory.MOUSE:
      return 'Mouse'
    case ItemCategory.PRINTER:
      return 'Printer'
    case ItemCategory.PROJECTOR:
      return 'Proyektor'
    case ItemCategory.WEB_CAM:
      return 'Web Cam'
    default:
      return category
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
      availabilityStatus: newStatus,
      stock: item.stock
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