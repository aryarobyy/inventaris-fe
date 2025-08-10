<template>
  <div class="p-6 min-h-screen">
    <div class="flex flex-col">
      <h1 class="text-2xl font-bold mb-4 text-white">Dashboard</h1>
      <!-- <Button 
        text="Download Excel"
        variant="outline"
        @click="handleClick"
      /> -->
      <TableLoan
        :showAction=true
        :admin="props.admin"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from '../../components/Button.vue';
import TableLoan from '../../components/TableLoan.vue'
import type { AdminModel } from '../../models/admin.model';
import { getXls } from '../../provider/xls.provider';

interface Props {
  showAction?: boolean;
  admin: AdminModel;
}

const props = withDefaults(defineProps<Props>(), {
  showAction: false,
})

const handleClick = async () => {
  try {
    console.log('Starting download...');
    const response = await getXls();
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    console.log('Blob size:', blob.size, 'Blob type:', blob.type);
    
    if (blob.size === 0) {
      throw new Error('Received empty file');
    }
    
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daftar_pinjaman.xlsx';
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    
    console.log('File download initiated successfully');
    
  } catch (error: any) {
    console.error('Error downloading Excel:', error);
    console.error('Error details:', error.message);
  }
};


</script>