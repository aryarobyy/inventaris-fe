<template>
  <div class="flex flex-col space-y-1 relative" ref="dropdownRef">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700">{{ label }}</label>

    <div
      class="border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      @click="toggleDropdown"
    >
      <div class="flex flex-row justify-between">
        <span>
          {{ displayText }}
        </span>
        <ChevronDown />
      </div>
    </div>

    <div
      v-if="isOpen"
      class="absolute z-10 mt-1 bg-white border border-gray-300 rounded shadow w-full max-h-60 overflow-auto"
    >
      <div
        v-for="(option, index) in options"
        :key="index"
        class="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
        @click.stop="toggleSelect(option)"
      >
        <input
          v-if="multiple"
          type="checkbox"
          class="mr-2"
          :checked="isSelected(option)"
          @change.prevent
        />
        <input
          v-else
          type="radio"
          class="mr-2"
          :checked="isSelected(option)"
          @change.prevent
        />
        <span>{{ option[labelKey] }}</span>
      </div>
    </div>

    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: any[] | any
  options: any[]
  label?: string
  name?: string
  id?: string
  error?: string
  valueKey: string
  labelKey: string
  multiple?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[] | any): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const selectedItems = computed(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  } else {
    return props.modelValue ? [props.modelValue] : []
  }
})

const displayText = computed(() => {
  if (props.multiple) {
    const validItems = selectedItems.value.filter(item =>
      props.options.some(option => option[props.valueKey] === item[props.valueKey])
    )
    return validItems.length > 0
      ? validItems.map(item => item[props.labelKey]).join(', ')
      : '-- Pilih --'
  } else {
    const selected = selectedItems.value[0]
    const match = props.options.find(option => option[props.valueKey] === selected?.[props.valueKey])
    return match ? match[props.labelKey] : '-- Pilih --'
  }
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const isSelected = (item: any) => {
  return selectedItems.value.some(selected => selected[props.valueKey] === item[props.valueKey])
}

const toggleSelect = (item: any) => {
  if (props.multiple) {
    const exists = isSelected(item)
    let newSelected

    if (exists) {
      newSelected = selectedItems.value.filter(
        (i) => i[props.valueKey] !== item[props.valueKey]
      )
    } else {
      newSelected = [...selectedItems.value, item]
    }

    emit('update:modelValue', newSelected)
  } else {
    emit('update:modelValue', item)
    isOpen.value = false 
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>