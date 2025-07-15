<template>
  <div v-if="props.isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      :class="[
        'relative max-w-md w-full rounded-lg border-2 shadow-lg transform transition-all',
        currentStyle.bg
      ]"
    >
      <button
        @click="handleClose"
        :class="[
          'absolute top-4 right-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors',
          currentStyle.button
        ]"
      >
        <X :size="20" />
      </button>

      <div class="p-6">
        <div class="flex items-start space-x-3">
          <div v-if="props.showIcon" :class="['flex-shrink-0', currentStyle.icon]">
            <component :is="IconComponent" :size="24" />
          </div>

          <div class="flex-1 min-w-0">
            <h3 :class="['text-lg font-semibold mb-2', currentStyle.title]">
              {{ props.title }}
            </h3>
            <p :class="['text-sm leading-relaxed', currentStyle.message]">
              {{ props.message }}
            </p>

            <div v-if="(props.variant === 'info' || props.variant === 'alert') && props.detailMessage" class="mt-3">
              <button
                v-if="!showDetail"
                @click="showDetail = true"
                :class="['text-sm underline hover:no-underline transition-all', currentStyle.button]"
              >
                Info lebih lanjut
              </button>
              <div v-else class="space-y-2">
                <p
                  v-html="props.detailMessage"
                  :class="['text-sm leading-relaxed', currentStyle.message]"
                ></p>
                <button
                  @click="showDetail = false"
                  :class="['text-sm underline hover:no-underline transition-all', currentStyle.button]"
                >
                  Sembunyikan detail
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-between gap-2">
          <button
            v-if="props.showLeftButton"
            @click="handleLeftClick"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md border border-transparent',
              'hover:bg-white hover:bg-opacity-20 transition-colors',
              currentStyle.button
            ]"
          >
            {{ props.leftButtonText }}
          </button>

          <div class="flex-1"></div>

          <button
            v-if="props.showRightButton"
            @click="handleRightClick"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md border border-transparent',
              'hover:bg-white hover:bg-opacity-20 transition-colors',
              currentStyle.button
            ]"
          >
            {{ props.rightButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
  variant: 'success' | 'error' | 'alert' | 'info';
  title: string;
  message: string;
  detailMessage?: string;
  showIcon?: boolean;

  leftButtonText?: string;
  rightButtonText?: string;
  showLeftButton?: boolean;
  showRightButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  variant: 'success',
  showIcon: true,
  showLeftButton: false,
  showRightButton: true,
  leftButtonText: 'Batal',
  rightButtonText: 'Tutup'
});

const emit = defineEmits(['close', 'left-click', 'right-click']);
const showDetail = ref(false);

const variantStyles = {
  success: {
    bg: 'bg-green-50 border-green-200',
    icon: 'text-green-600',
    title: 'text-green-800',
    message: 'text-green-700',
    button: 'text-green-600 hover:text-green-800'
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    title: 'text-red-800',
    message: 'text-red-700',
    button: 'text-red-600 hover:text-red-800'
  },
  alert: {
    bg: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-600',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
    button: 'text-yellow-600 hover:text-yellow-800'
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-800',
    message: 'text-blue-700',
    button: 'text-blue-600 hover:text-blue-800'
  }
};

const icons = {
  success: CheckCircle,
  error: XCircle,
  alert: AlertTriangle,
  info: Info
};

const currentStyle = computed(() => variantStyles[props.variant]);
const IconComponent = computed(() => icons[props.variant]);

const handleClose = () => {
  showDetail.value = false;
  emit('close');
};

const handleLeftClick = () => {
  showDetail.value = false;
  emit('left-click');
};

const handleRightClick = () => {
  showDetail.value = false;
  emit('right-click');
  handleClose();
};
</script>
