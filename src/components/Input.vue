<template>
  <div class="relative">
    <label
        v-if="title"
        :for="id"
        class="block mb-2 text-sm font-medium text-gray-900 "
    >
    {{ title }}
    </label>

    <input
        :type="isPasswordType && showPassword ? 'text' : type"
        :id="id"
        class="bg-[#FAFAF5] border border-[#D6D3C2] text-[#3D3A2A] text-sm rounded-lg focus:ring-[#7A745C] focus:border-[#7A745C] block w-full p-2.5 pr-10"
        :placeholder="placeHolder"
        :required="required"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <button
        v-if="isPasswordType"
        type="button"
        @click="toggleShowPassword"
        class="absolute top-[38px] right-3 text-gray-500 dark:text-gray-300"
    >
    <EyeClosed v-if="showPassword" class="w-5 h-5" />
    <Eye v-else class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Eye, EyeClosed } from 'lucide-vue-next'
import { ref, computed } from 'vue'


const props = defineProps<{
  modelValue: string
  id?: string
  title?: string
  placeHolder?: string
  required?: boolean
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
}>()

const emit = defineEmits(['update:modelValue'])

const showPassword = ref(false)
const isPasswordType = computed(() => props.type === 'password')

function toggleShowPassword() {
  showPassword.value = !showPassword.value
}
</script>
