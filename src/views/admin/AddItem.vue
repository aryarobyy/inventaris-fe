<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md space-y-4">
      <h2 class="text-2xl font-bold text-center mb-6">Item Details</h2>

      <MyInput
        v-model="name"
        title="Item Name"
        placeHolder="Enter item name"
        :required="true"
        type="text"
        id="name"
      />

      <MyInput
        v-model="description"
        title="Description"
        placeHolder="Enter item description"
        :required="false"
        type="text"
        id="description"
      />

      <MyInput
        v-model="quantity"
        title="Quantity"
        placeHolder="Enter quantity"
        :required="true"
        type="number"
        id="quantity"
      />

      <MyInput
        v-model="brand"
        title="Brand"
        placeHolder="Enter brand name"
        :required="false"
        type="text"
        id="brand"
      />

      <MyInput
        v-model="pairId"
        title="Pair ID"
        placeHolder="Enter pair ID (optional, numbers only)"
        :required="false"
        type="text"
        id="pairId"
      />

      <MyInput
        v-model="statusNotes"
        title="Status Notes"
        placeHolder="Add any status notes"
        :required="false"
        type="text"
        id="statusNotes"
      />

      <!-- Category Dropdown -->
      <Dropdown
        v-model="selectedCategory"
        :options="categoryOptions"
        label="Category *"
        valueKey="value"
        labelKey="label"
        :multiple="false"
        id="category"
      />

      <!-- Condition Status Dropdown -->
      <Dropdown
        v-model="selectedConditionStatus"
        :options="conditionStatusOptions"
        label="Condition Status *"
        valueKey="value"
        labelKey="label"
        :multiple="false"
        id="conditionStatus"
      />

      <!-- Availability Status Dropdown -->
      <Dropdown
        v-model="selectedAvailabilityStatus"
        :options="availabilityStatusOptions"
        label="Availability Status *"
        valueKey="value"
        labelKey="label"
        :multiple="false"
        id="availabilityStatus"
      />

      <button
        @click="handleUploadItem"
        class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
      >
        Submit Item
      </button>

      <div v-if="showNotificationPopup" class="mt-4 p-4 rounded-md text-center"
           :class="{ 'bg-red-100 text-red-800': popupType === 'error', 'bg-green-100 text-green-800': popupType === 'success' }">
        <h3 class="font-bold">{{ popupTitle }}</h3>
        <p>{{ popupMessage }}</p>
        <p v-if="popupDetailMessage" class="text-sm italic whitespace-pre-line">{{ popupDetailMessage }}</p>
        <button @click="showNotificationPopup = false" class="mt-2 text-blue-600 hover:underline">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import MyInput from '../../components/Input.vue';
import Dropdown from '../../components/Dropdown.vue';
import { useRouter } from 'vue-router';
import type { AdminModel } from '../../models/admin.model';
import { ItemAvailability, ItemCategory, ItemCondition } from '../../models/enums';
import type { PostItemModel } from '../../models/item.model';
import { postItem } from '../../provider/item.provider';

interface Props {
  showAction?: boolean;
  admin: AdminModel;
}

const props = withDefaults(defineProps<Props>(), {
  showAction: false,
})

const name = ref('');
const description = ref('');
const quantity = ref('');
const brand = ref('');
const pairId = ref('');
const statusNotes = ref('');

const selectedCategory = ref<{value: string, label: string} | null>(null);
const selectedConditionStatus = ref<{value: string, label: string} | null>(null);
const selectedAvailabilityStatus = ref<{value: string, label: string} | null>(null);

const showNotificationPopup = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupDetailMessage = ref('');
const popupType = ref<'success' | 'error' | ''>('');

const router = useRouter();

const categoryOptions = computed(() => {
  return Object.entries(ItemCategory).map(([key, value]) => ({
    value: value,
    label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }));
});

const conditionStatusOptions = computed(() => {
  return Object.entries(ItemCondition).map(([key, value]) => ({
    value: value,
    label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }));
});

const availabilityStatusOptions = computed(() => {
  return Object.entries(ItemAvailability).map(([key, value]) => ({
    value: value,
    label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }));
});

const handleUploadItem = async () => {
  showNotificationPopup.value = false;
  popupTitle.value = '';
  popupMessage.value = '';
  popupDetailMessage.value = '';
  popupType.value = '';

  let validationErrors: string[] = [];

  if (!name.value.trim()) {
    validationErrors.push('Nama Item tidak boleh kosong.');
  }

  if (!quantity.value.trim()) {
    validationErrors.push('Kuantitas tidak boleh kosong.');
  }

  if (!selectedCategory.value) {
    validationErrors.push('Kategori harus dipilih.');
  }

  if (!selectedConditionStatus.value) {
    validationErrors.push('Status Kondisi harus dipilih.');
  }

  if (!selectedAvailabilityStatus.value) {
    validationErrors.push('Status Ketersediaan harus dipilih.');
  }

  const parsedQuantity = parseInt(quantity.value);
  if (quantity.value.trim() && (isNaN(parsedQuantity) || parsedQuantity <= 0)) {
    validationErrors.push('Kuantitas harus berupa angka positif.');
  }

  const parsedPairId = pairId.value.trim() ? parseInt(pairId.value) : undefined;
  if (pairId.value.trim() && isNaN(parsedPairId as number)) {
    validationErrors.push('Pair ID harus berupa angka jika diisi.');
  }

  if (validationErrors.length > 0) {
    popupTitle.value = 'Input Tidak Lengkap / Tidak Valid';
    popupMessage.value = 'Terdapat beberapa masalah dengan input Anda:';
    popupDetailMessage.value = validationErrors.join('\n');
    popupType.value = 'error';
    showNotificationPopup.value = true;
    return;
  }

  const itemData: PostItemModel = {
    name: name.value,
    description: description.value,
    quantity: parsedQuantity,
    brand: brand.value,
    pairId: parsedPairId,
    stock: parsedQuantity,
    statusNotes: statusNotes.value,
    category: selectedCategory.value!.value as ItemCategory,
    conditionStatus: selectedConditionStatus.value!.value as ItemCondition,
    availabilityStatus: selectedAvailabilityStatus.value!.value as ItemAvailability,
  };

  try {
    const data = await postItem(itemData);
    console.log('Item berhasil diunggah:', data);

    popupTitle.value = 'Sukses!';
    popupMessage.value = 'Item berhasil ditambahkan.';
    popupDetailMessage.value = `ID Item: ${data?.id || 'N/A'}`;
    popupType.value = 'success';
    showNotificationPopup.value = true;

    name.value = '';
    description.value = '';
    quantity.value = '';
    brand.value = '';
    pairId.value = '';
    statusNotes.value = '';
    selectedCategory.value = null;
    selectedConditionStatus.value = null;
    selectedAvailabilityStatus.value = null;

  } catch (error: any) {
    console.error('Gagal mengunggah item:', error);

    popupTitle.value = 'Error!';
    popupMessage.value = 'Gagal menambahkan item. Silakan coba lagi.';
    popupDetailMessage.value = error.response?.data?.message || error.message || 'Terjadi kesalahan tidak terduga.';
    popupType.value = 'error';
    showNotificationPopup.value = true;
  }
};
</script>