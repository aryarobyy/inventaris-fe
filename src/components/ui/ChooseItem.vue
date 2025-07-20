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

    <div v-if="selectedItems.length > 0" class="pt-4">
      <h4 class="text-sm font-medium mb-3">Item Dipilih:</h4>
      <div class="space-y-3">
        <div 
          v-for="item in selectedItems" 
          :key="item.id"
          class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex-1">
            <span class="text-sm font-medium text-gray-800">{{ item.name }}</span>
            <span v-if="item.brand" class="text-sm text-gray-600"> - {{ item.brand }}</span>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">Qty:</label>
            <Input 
              v-model="itemQuantities[item.id]"
              placeHolder="0"
              type="number"
              :id="`quantity-${item.id}`"
              class="w-20"
              min="1"
              @input="updateQuantity(item.id, $event)"
            />
          </div>
          <button
            @click="removeItem(item)"
            class="text-red-500 hover:text-red-700 text-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineExpose } from 'vue'
import { ItemCategory } from '../../models/enums';
import type { ItemModel } from '../../models/item.model';
import { getItemByCat } from '../../provider/item.provider';
import Dropdown from '../Dropdown.vue';
import Input from '../Input.vue';

const selectedCategory = ref<{ label: string; value: ItemCategory | null }>({
  label: '--Pilih--',
  value: null
})
const items = ref<ItemModel[]>([])
const selectedItems = ref<ItemModel[]>([])
const isLoadingItems = ref(false)
const itemQuantities = ref<Record<string, string>>({})

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
      itemQuantities.value = {}
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
    delete itemQuantities.value[item.id]
  } else {
    selectedItems.value.push(item)
    itemQuantities.value[item.id] = '1'
  }
}

const removeItem = (item: ItemModel) => {
  const index = selectedItems.value.findIndex(i => i.id === item.id)
  if (index >= 0) {
    selectedItems.value.splice(index, 1)
    delete itemQuantities.value[item.id]
  }
}

const updateQuantity = (itemId: number, value: string) => {
  itemQuantities.value[itemId] = value
}

const isSelected = (item: ItemModel) => {
  return selectedItems.value.some(i => i.id === item.id)
}

defineExpose({
  getSelection: () => ({
    category: selectedCategory.value.value,
    items: selectedItems.value.map(item => ({
      ...item,
      quantity: parseInt(itemQuantities.value[item.id] || '1')
    }))
  }),
  reset: () => {
    selectedCategory.value = { label: '--Pilih--', value: null }
    selectedItems.value = []
    items.value = []
    itemQuantities.value = {}
  }
})
</script>