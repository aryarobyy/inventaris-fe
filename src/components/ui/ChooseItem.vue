<template>
  <div class="flex flex-col gap-4">
    <Dropdown 
      v-model="selectedCategory"
      :options="categoryOptions"
      value-key="value"
      label-key="label"
      label="Pilih Kategori"
    />

    <div v-if="isLoadingItems" class="flex items-center justify-center p-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      <span class="ml-2 text-gray-600">Loading items...</span>
    </div>

    <div
      v-if="selectedCategory.value !== null && !isLoadingItems && items.length > 0"
      class="flex flex-wrap gap-2"
    >
      <button
        v-for="item in items"
        :key="item.id"
        @click="toggleItem(item)"
        class="px-4 py-2 rounded border"
        :class="isSelected(item) ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'"
      >
        {{ item.name }}<span v-if="item.brand"> - {{ item.brand }}</span>
      </button>
    </div>

    <div 
      v-if="selectedCategory.value !== null && items.length === 0 && !isLoadingItems"
      class="p-3 text-center text-gray-500 bg-gray-100 rounded"
    >
      Tidak ada item tersedia untuk kategori ini
    </div>

    <!-- Pilihan yang sudah dipilih -->
    <div v-if="selectedItems.length > 0" class="pt-4">
      <h4 class="text-sm font-medium mb-2">Item Dipilih:</h4>
      <ul class="list-disc list-inside text-sm text-gray-700">
        <li v-for="item in selectedItems" :key="item.id">{{ item.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineExpose } from 'vue'
import { ItemCategory } from '../../models/enums';
import type { ItemModel } from '../../models/item.model';
import { getItemByCat } from '../../provider/item.provider';
import Dropdown from '../Dropdown.vue';

const selectedCategory = ref<{ label: string; value: ItemCategory | null }>({
  label: '--Pilih--',
  value: null
})
const items = ref<ItemModel[]>([])
const selectedItems = ref<ItemModel[]>([])
const isLoadingItems = ref(false)

const categoryOptions = Object.entries(ItemCategory).map(([key, value]) => ({
  label: key.replace(/_/g, ' ').toUpperCase(),
  value,
}))

watch(selectedCategory, async (newCategory) => {
  if (newCategory.value !== null) {
    isLoadingItems.value = true
    try {
      const response = await getItemByCat(newCategory.value)
      items.value = Array.isArray(response) ? response : []
      selectedItems.value = []
    } catch (error) {
      console.error('Error fetching items:', error)
      items.value = []
    } finally {
      isLoadingItems.value = false
    }
  }
}, { deep: true })

const toggleItem = (item: ItemModel) => {
  const index = selectedItems.value.findIndex(i => i.id === item.id)
  if (index >= 0) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(item)
  }
}

const isSelected = (item: ItemModel) => {
  return selectedItems.value.some(i => i.id === item.id)
}

defineExpose({
  getSelection: () => ({
    category: selectedCategory.value.value,
    items: selectedItems.value
  }),
  reset: () => {
    selectedCategory.value = { label: '--Pilih--', value: null }
    selectedItems.value = []
    items.value = []
  }
})
</script>
