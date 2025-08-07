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

      <MyInput
        v-model="category"
        title="Category"
        placeHolder="e.g., ELECTRONICS, FURNITURE"
        :required="true"
        type="text"
        id="category"
      />

      <MyInput
        v-model="conditionStatus"
        title="Condition Status"
        placeHolder="e.g., GOOD, DAMAGED, NEW"
        :required="true"
        type="text"
        id="conditionStatus"
      />

      <MyInput
        v-model="availabilityStatus"
        title="Availability Status"
        placeHolder="e.g., AVAILABLE, LOANED, MAINTENANCE"
        :required="true"
        type="text"
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
        <p v-if="popupDetailMessage" class="text-sm italic">{{ popupDetailMessage }}</p>
        <button @click="showNotificationPopup = false" class="mt-2 text-blue-600 hover:underline">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MyInput from '../../components/Input.vue';
import { useRouter } from 'vue-router';
import type { PostItemModel } from '../../models/item.model';
import { postItem } from '../../provider/item.provider';
import { ItemAvailability, ItemCategory, ItemCondition } from '../../models/enums';
import Dropdown from '../../components/Dropdown.vue';
import type { AdminModel } from '../../models/admin.model';

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

const category = ref('');
const conditionStatus = ref('');
const availabilityStatus = ref('');

const showNotificationPopup = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupDetailMessage = ref('');
const popupType = ref<'success' | 'error' | ''>('');

const router = useRouter();

function isValidEnumValue<T extends Record<string, string>>(enumObject: T, value: string): boolean {
  return Object.values(enumObject).includes(value as T[keyof T]);
}

const handleUploadItem = async () => {
  showNotificationPopup.value = false;
  popupTitle.value = '';
  popupMessage.value = '';
  popupDetailMessage.value = '';
  popupType.value = '';

  const requiredFields = [
    { value: name.value, name: 'Nama Item' },
    { value: quantity.value, name: 'Kuantitas' },
    { value: category.value, name: 'Kategori', enum: ItemCategory },
    { value: conditionStatus.value, name: 'Status Kondisi', enum: ItemCondition },
    { value: availabilityStatus.value, name: 'Status Ketersediaan', enum: ItemAvailability },
  ];

  let validationErrors: string[] = [];

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      validationErrors.push(`${field.name} tidak boleh kosong.`);
    }
  });

  const parsedQuantity = parseInt(quantity.value);
  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    validationErrors.push('Kuantitas harus berupa angka positif.');
  }

  if (category.value.trim() && !isValidEnumValue(ItemCategory, category.value)) {
      validationErrors.push(`Kategori tidak valid. Pilihan: ${Object.values(ItemCategory).join(', ')}.`);
  }
  if (conditionStatus.value.trim() && !isValidEnumValue(ItemCondition, conditionStatus.value)) {
      validationErrors.push(`Status Kondisi tidak valid. Pilihan: ${Object.values(ItemCondition).join(', ')}.`);
  }
  if (availabilityStatus.value.trim() && !isValidEnumValue(ItemAvailability, availabilityStatus.value)) {
      validationErrors.push(`Status Ketersediaan tidak valid. Pilihan: ${Object.values(ItemAvailability).join(', ')}.`);
  }

  if (validationErrors.length > 0) {
    popupTitle.value = 'Input Tidak Lengkap / Tidak Valid';
    popupMessage.value = 'Terdapat beberapa masalah dengan input Anda:';
    popupDetailMessage.value = validationErrors.join('\n');
    popupType.value = 'error';
    showNotificationPopup.value = true;
    return;
  }

  const parsedPairId = pairId.value.trim() ? parseInt(pairId.value) : undefined;
  if (pairId.value.trim() && isNaN(parsedPairId as number)) {
      popupTitle.value = 'Input Tidak Valid';
      popupMessage.value = 'Pair ID harus berupa angka jika diisi.';
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
    category: category.value.toUpperCase() as ItemCategory,
    conditionStatus: conditionStatus.value.toUpperCase() as ItemCondition,
    availabilityStatus: availabilityStatus.value.toUpperCase() as ItemAvailability,
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
    category.value = '';
    conditionStatus.value = '';
    availabilityStatus.value = '';

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

<style scoped>
</style>