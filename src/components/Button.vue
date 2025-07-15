<template>
  <button
    :type="'button'"
    :disabled="props.disabled || props.loading"
    :class="buttonClasses"
    @click="handleClick"
    v-bind="$attrs"
  >
    <span class="flex items-center justify-center space-x-2">
      <svg
        v-if="props.loading"
        class="animate-spin w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>

      <component
        :is="props.icon"
        v-if="!props.loading && props.icon && props.iconPosition === 'left'"
        :class="iconSizes[props.size]"
      />

      <span>{{ props.text }}</span>

      <component
        :is="props.icon"
        v-if="!props.loading && props.icon && props.iconPosition === 'right'"
        :class="iconSizes[props.size]"
      />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

interface Props {
  text: string;
  /**
   * @default 'modern'
   */
  variant?: 'modern' | 'ghost' | 'destructive' | 'outline' | 'accent' | 'custom';
  /**
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * @default false
   */
  loading?: boolean;
  /**
   * @default false
   */
  disabled?: boolean;
  icon?: any;
  /**
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'modern',
  size: 'medium',
  loading: false,
  disabled: false,
  iconPosition: 'left',
});

const attrs = useAttrs();

const emit = defineEmits(['click']);

const baseStyles = 'font-medium transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50';

const sizeStyles = {
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-6 py-2 text-base',
  large: 'px-8 py-3 text-lg'
};

const iconSizes = {
  small: 'w-4 h-4',
  medium: 'w-5 h-5',
  large: 'w-6 h-6'
};

const variantStyles = {
  modern: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md hover:shadow-lg focus:ring-blue-300 rounded-lg',
  ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 focus:ring-gray-300 rounded-md',
  destructive: 'bg-red-700 hover:bg-red-800 active:bg-red-900 text-white shadow-md hover:shadow-lg focus:ring-red-400 rounded-md',
  outline: 'bg-transparent hover:bg-blue-50 active:bg-blue-100 text-blue-600 hover:text-blue-700 border-2 border-blue-600 hover:border-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:ring-blue-300 rounded-md',
  accent: 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-gray-900 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:ring-yellow-300 rounded-full',
  custom: ''
};

const buttonClasses = computed(() => {
  const classes = [
    baseStyles,
    sizeStyles[props.size],
    variantStyles[props.variant],
    attrs.class as string || ''
  ].join(' ').trim().replace(/\s+/g, ' ');

  return classes;
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>
